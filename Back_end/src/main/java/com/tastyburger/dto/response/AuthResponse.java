package com.tastyburger.dto.response;

public class AuthResponse {
    private boolean success;
    private String token;
    private UserResponse user;

    public AuthResponse() {}
    public AuthResponse(boolean success, String token, UserResponse user) {
        this.success = success;
        this.token = token;
        this.user = user;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
}
