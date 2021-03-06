import logo from "../assets/images/logo.svg";
import headerImg from "../assets/images/header.png";

const Header = () => (
  <header
    style={{ borderColor: "#afc75d" }}
    className="border-b-4 pt-12  py-4 bg-white"
  >
    <div>
      <img
        src={headerImg}
        className="absolute top-0 w-full"
        alt="Defensoria de niñas, Niños y Adolecentes"
      />
    </div>
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 px-3 md:p-0 space-x-6">
        <a href="https://www.defensorianna.gob.ar/">
          <img
            src={logo}
            alt="Defensor&iacute;a de ni&ntilde;as, ni&ntilde;os y adolescentes"
          />
        </a>
        <div>
          <h1 className="text-2xl md:w-9/12 md:float-right">
            Georreferencia del Sistema de Protección de Niños, Niñas y
            Adolescentes de la Provincia de Santa Fe
          </h1>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
