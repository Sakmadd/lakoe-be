class RegisterDto {
  name: string;
  email: string;
  password: string;
  constructor({ name, password, email }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export default RegisterDto;
