import React from "react";
import { Link } from "react-router-dom";
import  Button   from "../../shared/ui/Button";
import { MetaTags } from "../../app/seo/MetaTags";

const NotFound: React.FC = () => {
  return (
    <>
      <MetaTags title="Сторінку не знайдено" />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="text-7xl font-black text-gold-400">404</div>
        <div className="text-2xl font-semibold text-gold-200">
          Ой! Такої сторінки немає.
        </div>
        <p className="text-gray-400 max-w-md">
          Можливо, ви неправильно ввели адресу, або сторінка була видалена.
        </p>
        <Link to="/">
          <Button>На головну</Button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
