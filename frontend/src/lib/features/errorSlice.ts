import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import errorAPI from "../../services/error.service";
import { ErrorInterface } from "@/types/type";

export const fetchAllErrors = createAsyncThunk(
  "errors/fetchAllStatus",
  async (_, thunkAPI) => {
    try {
      const res = await errorAPI.fetchAll();
      return res.data;
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

interface ErrorsState {
  data: ErrorInterface[];
  loading: "idle" | "pending";
  error: null | unknown;
}

const initialState = {
  data: [],
  loading: "idle",
  error: null,
} satisfies ErrorsState as ErrorsState;

const errorLogSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllErrors.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchAllErrors.fulfilled, (state, action) => {
        state.loading = "idle";
        state.data = action.payload;
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

export default errorLogSlice.reducer;
