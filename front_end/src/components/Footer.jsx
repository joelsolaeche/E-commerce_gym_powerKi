import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <span className="text-orange-500">⚡</span>
              <span className="ml-2">Power Ki Gym</span>
            </h3>
            <p className="text-gray-600 text-sm">
              Tu tienda especializada en productos Dragon Ball Z. 
              Entrenamientos épicos para guerreros legendarios.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.482-1.995.699 0 1.037.219 1.037 1.037 0 .631-.399 1.574-.606 2.447-.173.731.367 1.329 1.096 1.329 1.315 0 2.326-1.386 2.326-3.387 0-1.77-1.270-3.009-3.085-3.009-2.105 0-3.343 1.574-3.343 3.202 0 .635.244 1.316.549 1.686.060.073.069.137.051.212-.056.227-.18.719-.204.820-.031.131-.101.159-.233.096-1.3-.605-2.112-2.502-2.112-4.028 0-3.282 2.386-6.295 6.885-6.295 3.598 0 6.397 2.564 6.397 5.993 0 3.578-2.254 6.456-5.388 6.456-1.052 0-2.042-.547-2.379-1.207 0 0-.520 1.977-.646 2.46-.234.898-.866 2.023-1.289 2.707.97.299 1.996.461 3.063.461 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Contacto</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Planet Namek, Universe 7</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) KAKAROT</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@powerkigym.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lun - Vie: 9:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Métodos de Pago</h3>
            <p className="text-sm text-gray-600 mb-3">Aceptamos las siguientes formas de pago:</p>
            
            {/* Credit Cards */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {/* Visa */}
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center">
                  <span>VISA</span>
                </div>
                
                {/* Mastercard */}
                <div className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center">
                  <span>MC</span>
                </div>
                
                {/* American Express */}
                <div className="bg-blue-800 text-white px-3 py-1 rounded text-xs font-bold flex items-center">
                  <span>AMEX</span>
                </div>
                
                {/* Discover */}
                <div className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center">
                  <span>DISC</span>
                </div>
              </div>
              
              {/* Security badges */}
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                  <span>Compra Segura</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  <span>SSL Cifrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 Power Ki Gym. Todos los derechos reservados.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-orange-500 transition-colors">Términos y Condiciones</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Política de Privacidad</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Política de Devoluciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
