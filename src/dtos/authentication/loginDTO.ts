class LoginDTO {
  email: string;
  password: string;

  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}

export default LoginDTO;
