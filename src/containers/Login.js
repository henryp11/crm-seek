"use Client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CustomInput from "../components/CustomInput";
// import ErrorLayout from '../components/ErrorLayout';
import styles from "../styles/forms.module.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  getAuth,
} from "firebase/auth";
import { autentication } from "../server/firebase";

const Login = () => {
  const router = useRouter();
  const auth = getAuth();

  const initialState = {
    email: "",
    password: "",
  };

  const [dataUser, setDataUser] = useState(initialState);
  const [createForm, setCreateForm] = useState(false);

  useEffect(() => {
    const tokenLS = localStorage.getItem("jwt");
    const tokenStorage = tokenLS && JSON.parse(tokenLS);
    console.log(tokenStorage);
    if (tokenLS !== null) {
      if (JSON.parse(tokenLS).length > 0) router.push("/modules");
    }
  }, []);

  //2º useEffect que almacenará el token en local storage
  // useEffect(() => {
  //   localStorage.setItem("jwt", JSON.stringify(token));
  //   localStorage.setItem("payload", JSON.stringify(payloadJwt));
  // }, [token]);

  const handleChange = (e) => {
    // const {name, value} = e.target; //Se puede desestructurar el evento como objeto
    setDataUser({ ...dataUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  const registerUser = async () => {
    try {
      if (createForm) {
        const userCredential = await createUserWithEmailAndPassword(
          autentication,
          dataUser.email,
          dataUser.password
        );
        console.log(userCredential);
        localStorage.setItem(
          "jwt",
          JSON.stringify(userCredential.user.accessToken)
        );
        toast.success(`Se ha creado su usuario con éxito!`, {
          duration: 2000,
        });
        sendEmailVerification(auth.currentUser).then(() => {
          toast.success(
            `Por favor verificar su cuenta mediante el mail de verificación que se acaba de envía a su correo`,
            {
              duration: 7000,
            }
          );
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(
          autentication,
          dataUser.email,
          dataUser.password
        );
        console.log(userCredential);
        localStorage.setItem(
          "jwt",
          JSON.stringify(userCredential.user.accessToken)
        );
        toast.success(`Bienvenido ${userCredential.user.email}!`, {
          duration: 2000,
        });
        router.push("/modules");
      }
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Este correo ya está en uso!", { duration: 3000 });
      } else if (error.code === "auth/invalid-email") {
        toast.error("Correo Inválido!", { duration: 3000 });
      } else if (error.code === "auth/weak-password") {
        toast.error(
          "Contraseña demasiado corta, debe tener mínimo 6 caracteres!",
          { duration: 3000 }
        );
      } else if (error.code === "auth/invalid-login-credentials") {
        toast.error("Credenciales inválidas!", { duration: 3000 });
      } else {
        toast.error(`${error.code} - ${error.message}`, { duration: 3000 });
      }
    }
  };

  return (
    <>
      <div className={styles["loginContainer"]}>
        <form onSubmit={handleSubmit} className={styles["form-default"]}>
          <CustomInput
            typeInput="text"
            nameInput="email"
            valueInput={dataUser.email}
            onChange={handleChange}
            nameLabel="Correo"
            required={true}
          />
          <CustomInput
            typeInput="password"
            nameInput="password"
            valueInput={dataUser.password}
            onChange={handleChange}
            nameLabel="Contraseña"
            required={true}
          />
          <button className={styles["formButton"]}>Acceder</button>
          <button
            className={`${styles.formButton} ${styles.registerButton}`}
            onClick={() => {
              setCreateForm(true);
            }}
          >
            Registrarse
          </button>
          {/* <Link href="/recovery/recoverypass" className={styles['recovery']}>
            Reestablecer Contraseña
          </Link> */}
          {/* <Link href="/account" className={styles["recovery"]}>
            Crear Cuenta
          </Link> */}
        </form>
      </div>
    </>
  );
};

export default Login;
