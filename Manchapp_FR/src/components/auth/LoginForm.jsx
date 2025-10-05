import { useState } from "react";
import FormField from "../ui/FormField";
import Button from "../ui/Button";

const LoginForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  // validacion de formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "El email es requerido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <FormField
        label="Email"
        id="username"
        name="username"
        type="email"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        required
        placeholder="tu@email.com"
      />

      <FormField
        label="Contraseña"
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <Button type="submit" fullWidth>
        Ingresar
      </Button>
    </form>
  );
};

export default LoginForm;
