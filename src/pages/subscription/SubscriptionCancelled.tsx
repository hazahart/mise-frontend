import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function SubscriptionCancelled() {
    return (
        <div className="max-w-md mx-auto text-center py-20">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                Pago cancelado
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mb-8">
                No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.
            </p>
            <Link
                to="/suscripcion"
                className="inline-block px-8 py-3 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-full font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
            >
                Ver planes
            </Link>
        </div>
    );
}