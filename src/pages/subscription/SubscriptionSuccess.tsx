import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function SubscriptionSuccess() {
    return (
        <div className="max-w-md mx-auto text-center py-20">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                ¡Bienvenido a Premium!
            </h1>
            <p className="text-stone-500 dark:text-stone-400 mb-8">
                Tu suscripción está activa. Ahora tienes acceso a todo el contenido exclusivo de Mise.
            </p>
            <Link
                to="/"
                className="inline-block px-8 py-3 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-full font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
            >
                Explorar recetas premium
            </Link>
        </div>
    );
}