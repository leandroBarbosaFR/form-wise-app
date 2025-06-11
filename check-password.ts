import bcrypt from "bcryptjs";

const plainPassword = "Formwise13011";
const hash = "$2b$10$ayYUlU1gzWj0WbCGEJvQoON4KlTzg0XDzU6GWbY8hPh0GcNlXWQze";

bcrypt.compare(plainPassword, hash).then((match) => {
  console.log("Mot de passe OK :", match);
});
