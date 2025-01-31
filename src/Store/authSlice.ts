import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "AIzaSyDJqR5RBtO_CdMzx21ZogTX8mGAd7hJhwg";

const service = axios.create({
  baseURL: `https://identitytoolkit.googleapis.com/v1`,
  params: {
    key: API_KEY,
  },
});

const refreshService = axios.create({
  baseURL: `https://securetoken.googleapis.com/v1`,
  params: {
    key: API_KEY,
  },
});

interface AuthState {
  user: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  status: "idle",
  error: null,
};

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await service.post("/accounts:signUp", {
      email,
      password,
      returnSecureToken: true,
    });
    return response.data;
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await service.post("/accounts:signInWithPassword", {
      email,
      password,
      returnSecureToken: true,
    });
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string) => {
    const response = await refreshService.post("/token", {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      window.location.replace("/login");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          ...state.user,
          idToken: action.payload.id_token,
          refreshToken: action.payload.refresh_token,
        };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
