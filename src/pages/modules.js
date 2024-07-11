import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { autentication } from "../server/firebase";
import { redirectJwt } from "../helpers/FunctionsHelps";
import ModulesMain from "../containers/ModulesMain";

const Modules = () => {
  const router = useRouter();
  const auth = getAuth();

  const [emailVerified, setMailVerified] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    onAuthStateChanged(autentication, async (user) => {
      if (user) {
        setMailVerified(auth.currentUser?.emailVerified);
        setUserEmail(auth.currentUser?.email);
      } else {
        console.log("No data!");
      }
    });
    redirectJwt(router);
  }, []);

  return emailVerified ? (
    <ModulesMain />
  ) : (
    <div
      style={{
        margin: "80px auto",
        textAlign: "center",
        border: "2px solid #ffb90f",
        width: "60%",
        padding: "8px",
        borderRadius: "8px",
        fontSize: "1.3em",
      }}
    >
      {`Por favor Verifica tu cuenta con el mail de verificación enviado a tu
      correo electrónico: `}
      <strong>{`${userEmail}`}</strong>
    </div>
  );
};

export default Modules;
