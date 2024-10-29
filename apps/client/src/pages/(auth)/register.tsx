import { Button, CardFooter, Input, Link } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

import { CenteredCard } from "@/components";
import { PasswordInput } from "@/components/PasswordInput";
import http from "@/http";
import { sleep } from "@/utils";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      await http.post("/auth/register", data);
      toast.success("Account created successfully!");
      await sleep(1000);
      location.replace("/login");
    } catch (error) {
      http.handleError(error);
    }

    setIsLoading(false);
  };

  return (
    <CenteredCard title="Register">
      <form className="grid grid-cols-12 gap-3" onSubmit={handleSubmit}>
        <Input
          className="col-span-12"
          errorMessage="Lütfen geçerli bir e-posta adresi girin."
          isRequired
          label="Email"
          name="email"
          type="email"
        />

        <Input
          className="col-span-12 md:col-span-6"
          errorMessage="Lütfen geçerli bir isim girin."
          isRequired
          label="İsim"
          name="firstName"
        />

        <Input
          className="col-span-12 md:col-span-6"
          errorMessage="Lütfen geçerli bir soyisim girin."
          isRequired
          label="Soyisim"
          name="lastName"
        />

        <Input
          className="col-span-12"
          errorMessage="Lütfen geçerli bir T.C. Kimlik Numarası girin."
          isRequired
          label="T.C. Kimlik Numarası"
          maxLength={11}
          minLength={11}
          name="nationalId"
        />

        <Input
          className="col-span-12"
          errorMessage="Lütfen geçerli bir doğum tarihi girin."
          isRequired
          label="Doğum Tarihi"
          name="birthDate"
          type="date"
        />

        <Input
          className="col-span-12"
          description="Örnek: 5XX-XXX-XXXX"
          errorMessage="Lütfen geçerli bir telefon numarası girin."
          isRequired
          label="Telefon Numarası"
          name="phone"
          type="tel"
        />

        <PasswordInput
          className="col-span-12"
          errorMessage="Şifre en az 8 karakter olmalıdır."
          label="Şifre"
          minLength={8}
          name="password"
        />
        <PasswordInput
          className="col-span-12"
          errorMessage="Lütfen şifrenizi tekrar girin."
          label="Şifre Tekrar"
        />
        <Button color="primary" fullWidth isLoading={isLoading} type="submit">
          Kayıt Ol
        </Button>
      </form>
      <CardFooter className="flex-col justify-center">
        <p>Zaten bir hesabınız var mı?</p>
        <Link href="/login">Giriş Yap</Link>
      </CardFooter>
    </CenteredCard>
  );
};

export default Register;
