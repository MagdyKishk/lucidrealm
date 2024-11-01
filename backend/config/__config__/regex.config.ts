const regexConfig = {
  email: /^[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.[\p{L}{2,}]+$/u,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.\-+%])[A-Za-z\d.\-+%]{8,}$/,
}

export default regexConfig;
