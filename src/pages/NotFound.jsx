import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-blackDeep text-primary">
      <div className="text-center  ">
        <h1 className="text-8xl font-bold mb-4 text-gold">404</h1>
        <p className="text-2xl mb-6">Página no encontrada</p>
        <p className="text-lg mb-8 text-ice/60">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-graphite text-primary rounded-md hover:bg-steel transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default NotFound;