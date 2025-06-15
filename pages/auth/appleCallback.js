import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AppleCallback() {
  const router = useRouter();

  useEffect(() => {
    const form = document.forms.appleForm;
    if (form) {
      const formData = new FormData(form);
      const id_token = formData.get("id_token");
      const code = formData.get("code");

      if (id_token) {
        fetch("/api/auth/apple", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_token }),
        })
          .then((res) => res.json())
          .then((data) => {
            document.cookie = `user=${JSON.stringify(data)}; path=/;`;
            router.push("/");
          });
      }
    }
  }, []);

  return (
    <form id="appleForm" method="post">
      <input type="hidden" name="id_token" />
      <input type="hidden" name="code" />
      <input type="hidden" name="state" />
    </form>
  );
}
