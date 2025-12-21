import { toast } from 'react-toastify';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const baseConfig = {
  position: "top-right",
  autoClose: 3050,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const customToast = (type, message, icon) => {
  toast(
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-full ${
        type === 'success' ? 'bg-gold/20' :
        type === 'error' ? 'bg-red-900/30' :
        type === 'warning' ? 'bg-yellow-900/30' :
        'bg-blue-900/30' 
      }`}>
        {icon}
      </div>
      <div>
        <p className="font-semibold text-ice">
          {type === 'success' ? '¡Éxito!' :
           type === 'error' ? 'Error' :
           type === 'warning' ? 'Atención' :
           type === 'info' ? 'Información' :
           type === 'bye' ? '¡Hasta pronto!' :
           'Mensaje'}
        </p>
        <p className="text-sm text-ice mt-1">{message}</p>
      </div>
    </div>,
    {
      ...baseConfig,
      className: 'bg-graphite border border-steel/50 rounded-xl shadow-2xl',
      bodyClassName: 'p-4 md:p-5',
      progressClassName: type === 'success' ? 'bg-gold' : 
                          type === 'error' ? 'bg-red-500' : 
                          type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500',
    }
  );
};

export const toastSuccess = (message) => 
  customToast('success', message, <CheckCircle className="w-7 h-7 text-gold" />);

export const toastError = (message) => 
  customToast('error', message, <XCircle className="w-7 h-7 text-red-400" />);

export const toastWarning = (message) => 
  customToast('warning', message, <AlertCircle className="w-7 h-7 text-yellow-400" />);

export const toastInfo = (message) => 
  customToast('info', message, <Info className="w-7 h-7 text-blue-400" />);

export const toastBye = (message) =>
  customToast('bye', message, <CheckCircle className="w-7 h-7 text-gold"/>)