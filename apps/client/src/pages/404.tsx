import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

import { CenteredCard } from "@/components";

const NotFound = () => {
  return (
    <CenteredCard title="Not Found - 404">
      <div className="grid place-items-center gap-3">
        <p className="max-w-sm text-center text-lg text-red-500">
          Ne yazık ki aradığınız sayfa bulunamadı.
        </p>

        <Button as={Link} color="primary" fullWidth to={"/"}>
          <strong>Anasayfaya Dön</strong>
        </Button>
      </div>
    </CenteredCard>
  );
};

export default NotFound;
