import axios, { AxiosResponse } from "axios";

interface ApiUser {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    nickname: string;
    PhoneNumber: string;
    VerifyPhone: boolean;
    VerifyEmail: boolean;
    roles: string;
    // ...其他旧数据字段
  };
}

interface BackUser {
  success: boolean;
  data: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    nickname: string;
    PhoneNumber: string;
    VerifyPhone: boolean;
    VerifyEmail: boolean;
    roles: string[];
    accessToken: string;
    refreshToken: string;
    expires: string;
  };
}

const transformUserData = (ApiUser: ApiUser): BackUser => {
  return {
    success: true,
    data: {
      id: ApiUser.user.id,
      username: ApiUser.user.username,
      email: ApiUser.user.email,
      confirmed: ApiUser.user.confirmed,
      blocked: ApiUser.user.blocked,
      createdAt: ApiUser.user.createdAt,
      updatedAt: ApiUser.user.updatedAt,
      nickname: ApiUser.user.nickname,
      PhoneNumber: ApiUser.user.PhoneNumber,
      VerifyPhone: ApiUser.user.VerifyPhone,
      VerifyEmail: ApiUser.user.VerifyEmail,
      roles: [ApiUser.user.roles],
      // accessToken: `${ApiUser.user.accessToken}.${ApiUser.user.username}`,
      accessToken: "",
      refreshToken: `eyJhbGciOiJIUzUxMiJ9.${ApiUser.user.roles}Refresh`,
      expires: "2023/10/30 00:00:00"
    }
  };
};

const sendLoginRequest = async (requestData: any): Promise<BackUser | null> => {
  const apiUrl = "https://sapi.kjchmc.cn/api/auth/local";

  try {
    const response: AxiosResponse<ApiUser> = await axios.post<ApiUser>(
      apiUrl,
      requestData
    );

    console.log("Response Data:", response.data); // 打印一下后端返回的数据

    if (response.data && response.data.jwt) {
      const BackUser: BackUser = transformUserData(response.data);
      BackUser.data.accessToken = `${response.data.jwt}.${BackUser.data.roles}`;
      return BackUser;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Login request error:", error);
    return null;
  }
};

export default sendLoginRequest;
