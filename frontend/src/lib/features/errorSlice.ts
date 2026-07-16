import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import errorAPI from "../../services/error.service";
import { ErrorInterface } from "@/types/type";

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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ErrorsState {
  data: ErrorInterface[];
  pagination: Pagination | null;
  loading: "idle" | "pending";
  error: null | unknown;
}

const initialState = {
  data: [],
  pagination: null,
  loading: "idle",
  error: null,
} satisfies ErrorsState as ErrorsState;

const errorLogSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
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
        state.data = action.payload.data;
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
        state.data = action.payload;
      })
      .addCase(fetchOneByFingerprint.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.payload;
      });
  },
});
export const { setInitialData } = errorLogSlice.actions;
export default errorLogSlice.reducer;
