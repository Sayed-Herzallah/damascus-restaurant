import React, { createContext, useContext, useState, useEffect } from "react";
import { ReservationDetails } from "@/components/reservation/ReservationReceipt";

type ReservationContextType = {
  reservations: ReservationDetails[];
  addReservation: (res: ReservationDetails) => void;
  deleteReservation: (refCode: string) => void;
};

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

// Initial mock reservations for demo purposes if localStorage is empty
const defaultReservations: ReservationDetails[] = [
  {
    name: "سليم كنعان",
    email: "salim@gmail.com",
    phone: "079 555 4321",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    time: "19:00",
    guests: "4",
    session: "outdoor",
    requests: "طاولة مطلة على تراس الياسمين وتوفر مقعد للأطفال.",
    refCode: "LS-4931-K",
    tableCode: "T-12"
  },
  {
    name: "Rania Haddad",
    email: "rania@example.com",
    phone: "+962 7 9888 7766",
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0], // Day after tomorrow
    time: "20:00",
    guests: "2",
    session: "indoor",
    requests: "Celebrating our wedding anniversary, a quiet table please.",
    refCode: "LS-8812-E",
    tableCode: "T-3"
  }
];

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<ReservationDetails[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("layali_reservations");
    if (stored) {
      try {
        setReservations(JSON.parse(stored));
      } catch (e) {
        setReservations(defaultReservations);
      }
    } else {
      setReservations(defaultReservations);
      localStorage.setItem("layali_reservations", JSON.stringify(defaultReservations));
    }
  }, []);

  const saveReservations = (newRes: ReservationDetails[]) => {
    setReservations(newRes);
    localStorage.setItem("layali_reservations", JSON.stringify(newRes));
  };

  const addReservation = (res: ReservationDetails) => {
    const updated = [res, ...reservations];
    saveReservations(updated);
  };

  const deleteReservation = (refCode: string) => {
    const updated = reservations.filter((res) => res.refCode !== refCode);
    saveReservations(updated);
  };

  return (
    <div className="transition-all duration-300">
      <ReservationContext.Provider value={{ reservations, addReservation, deleteReservation }}>
        {children}
      </ReservationContext.Provider>
    </div>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (!context) throw new Error("useReservations must be used within a ReservationProvider");
  return context;
}
