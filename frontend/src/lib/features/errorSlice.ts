import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import errorAPI from "../../services/error.service";
import { ErrorDetailInterface, ErrorInterface } from "@/types/type";

export const fetchAllErrors = createAsyncThunk(
  "errors/fetchAllStatus",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const res = await errorAPI.fetchAll(page, limit);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const fetchOneByFingerprint = createAsyncThunk(
  "errors/fetchOneStatus",
  async (id: string, thunkAPI) => {
    try {
      const res = await errorAPI.fetchOne(id);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const retryAnalysis = createAsyncThunk(
  "error/retry",
  async (id: string, thunkAPI) => {
    try {
      await errorAPI.retry(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AiErrorPayload {
  ai_status: "failed";
  previous_result: Pick<
    ErrorDetailInterface,
    "ai_reason" | "ai_suggestion" | "file_path" | "line" | "raw_line_text"
  > | null;
}

interface ErrorsState {
  list: ErrorInterface[];
  detail: ErrorDetailInterface | null;
  pagination: Pagination | null;
  loading: "idle" | "pending";
  error: null | unknown;
  aiReasonBuffer: string;
  aiSuggestionBuffer: string;
}

const initialState = {
  list: [],
  detail: null,
  pagination: null,
  loading: "idle",
  error: null,
  aiReasonBuffer: "",
  aiSuggestionBuffer: "",
} satisfies ErrorsState as ErrorsState;

const errorLogSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
    },

    setDetailData: (state, action: PayloadAction<ErrorDetailInterface>) => {
      state.detail = action.payload;
    },

    aiAnalysisStart: (state) => {
      if (state.detail && !Array.isArray(state.detail)) {
        state.detail.ai_status = "pending";
      }
      state.aiReasonBuffer = "";
      state.aiSuggestionBuffer = "";
    },

    aiReasonChunkReceived: (state, action: PayloadAction<string>) => {
      state.aiReasonBuffer += action.payload;
    },

    aiSuggestionChunkReceived: (state, action: PayloadAction<string>) => {
      state.aiSuggestionBuffer += action.payload;
    },

    aiAnalysisComplete: (
      state,
      action: PayloadAction<
        Pick<
          ErrorDetailInterface,
          "ai_status" | "file_path" | "line" | "raw_line_text"
        >
      >,
    ) => {
      if (state.detail && !Array.isArray(state.detail)) {
        state.detail.ai_status = action.payload.ai_status;
        state.detail.ai_reason = state.aiReasonBuffer;
        state.detail.ai_suggestion = state.aiSuggestionBuffer;
        state.detail.file_path = action.payload.file_path;
        state.detail.line = action.payload.line;
        state.detail.raw_line_text = action.payload.raw_line_text;
      }
    },

    aiAnalysisError: (state, action: PayloadAction<AiErrorPayload>) => {
      if (state.detail && !Array.isArray(state.detail)) {
        if (action.payload.previous_result) {
          Object.assign(state.detail, action.payload.previous_result);
        }
        state.detail.ai_status = action.payload.ai_status;
      }
    },
    updateErrorStatus: (
      state,
      action: PayloadAction<{
        id: string;
        ai_status: "pending" | "success" | "failed";
      }>,
    ) => {
      if (!Array.isArray(state.list)) return;

      const error = state.list.find(
        (item) => item.error_group_id === action.payload.id,
      );

      if (error) {
        error.ai_status = action.payload.ai_status;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllErrors.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchAllErrors.fulfilled, (state, action) => {
        state.loading = "idle";
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllErrors.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload;
      })

      .addCase(fetchOneByFingerprint.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchOneByFingerprint.fulfilled, (state, action) => {
        state.loading = "idle";
        state.detail = action.payload;
      })
      .addCase(fetchOneByFingerprint.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload;
      })

      .addCase(retryAnalysis.pending, (state) => {
        state.error = null;
      })
      .addCase(retryAnalysis.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setInitialData,
  setDetailData,
  aiAnalysisStart,
  aiReasonChunkReceived,
  aiSuggestionChunkReceived,
  aiAnalysisComplete,
  aiAnalysisError,
  updateErrorStatus,
} = errorLogSlice.actions;

export default errorLogSlice.reducer;
