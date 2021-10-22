import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";

import {
  DefaultStatus,
  DefaultUserInfo,
} from "../../../src/constants/constants";
import { Status, UserResponse } from "../../../src/interfaces/interfaces";
import { LoginResponse, RegisterResponse } from "./auth-response";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerResponse: RegisterResponse) => {
    const { data } = await axios.post<{ token: string }>(
      `${process.env.API_URL}/api/auth/register`,
      registerResponse
    );

    localStorage.setItem("token", data.token);

    return data.token;
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginResponse: LoginResponse) => {
    const { data } = await axios.post<{ token: string }>(
      `${process.env.API_URL}/api/auth/login`,
      loginResponse
    );

    localStorage.setItem("token", data.token);

    return data.token;
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
});

export interface AuthState {
  userInfo: UserResponse;
  status: Status;
}

const initialState: AuthState = {
  userInfo: DefaultUserInfo,
  status: DefaultStatus,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearStatus: (state) => {
      state.status = DefaultStatus;
    },
    clearUserInfo: (state) => {
      state.userInfo = DefaultUserInfo;
    },
  },
  extraReducers: (builder) => {
    // registerUser - Reducers
    builder.addCase(registerUser.pending, (state) => {
      state.status.isFetching = true;
    });

    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      const decodedToken = jwtDecode<UserResponse>(payload);
      state.userInfo = decodedToken;
      state.status.isSuccess = true;
      state.status.isFetching = false;
    });

    builder.addCase(registerUser.rejected, (state, { error }) => {
      state.status.isFetching = false;
      state.status.isError = true;
      state.status.errorMessage = error.message || "";
    });

    // loginUser - Reducers
    builder.addCase(loginUser.pending, (state) => {
      state.status.isFetching = true;
    });

    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      const decodedToken = jwtDecode<UserResponse>(payload);
      state.userInfo = decodedToken;
      state.status.isSuccess = true;
      state.status.isFetching = false;
    });

    builder.addCase(loginUser.rejected, (state, { error }) => {
      state.status.isFetching = false;
      state.status.isError = true;
      state.status.errorMessage = error.message || "";
    });

    // logoutUser - Reducers
    builder.addCase(logoutUser.pending, (state) => {
      state.status.isFetching = true;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      // Setting isSuccess to false to log out
      state.status.isSuccess = false;
      state.status.isFetching = false;
    });

    builder.addCase(logoutUser.rejected, (state) => {
      state.status.isError = true;
      state.status.errorMessage = "Unable to log out";
    });
  },
});

export const { clearStatus, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
