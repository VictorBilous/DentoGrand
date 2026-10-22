import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import BookingModal from './BookingModal.jsx';

const BookingContext = createContext({ openBooking: () => {} });

/** Одно модальное окно записи на приём для всего сайта: открывается из шапки и с главной страницы. */
export function BookingProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openBooking = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      {open && <BookingModal onClose={close} />}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
