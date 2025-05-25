import { useQuery } from "@tanstack/react-query";
import { Patient } from "@/lib/types";
import { format } from "date-fns";
import { Calendar, Clock, CreditCard, User } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/lib/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PatientHeader = () => {
  const { selectedPatientId } = useContext(UserContext);
  
  const { data: patient, isLoading, error } = useQuery<Patient>({
    queryKey: [`/api/patients/${selectedPatientId}`],
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-6 w-48 bg-primary/20 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-primary/20 rounded animate-pulse mt-2"></div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-destructive">Error loading patient information</div>
        </div>
      </div>
    );
  }

  const formattedLastUpdated = patient.lastUpdated ? format(new Date(patient.lastUpdated), "PPpp") : "N/A";
  
  // Generate avatar image URL based on patient ID
  const avatarUrl = `https://randomuser.me/api/portraits/${patient.gender === 'Female' ? 'women' : 'men'}/${patient.id + 20}.jpg`;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/5 w-full">
      <div className="max-w-full sm:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3 flex-shrink-0">
              <AvatarImage src={avatarUrl} alt={patient.name} />
              <AvatarFallback>{patient.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0"> {/* This prevents text overflow */}
              <h2 className="text-base sm:text-lg font-medium text-foreground flex items-center flex-wrap">
                <span className="truncate mr-2">{patient.name}</span>
                <div className={`px-1.5 sm:px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${
                  patient.status === 'Discharge Ready' 
                    ? 'bg-green-100 text-green-700' 
                    : patient.status === 'Critical' 
                      ? 'bg-red-100 text-red-700'
                      : 'bg-accent/20 text-accent-foreground'
                }`}>
                  {patient.status}
                </div>
              </h2>
              <div className="flex flex-wrap items-center text-xs sm:text-sm mt-1 text-muted-foreground">
                <div className="flex items-center mr-2 sm:mr-3 mb-0.5 sm:mb-0">
                  <Calendar className="h-3 w-3 mr-1 text-primary/70" />
                  <span>{patient.dob}</span>
                </div>
                <div className="flex items-center mr-2 sm:mr-3 mb-0.5 sm:mb-0">
                  <CreditCard className="h-3 w-3 mr-1 text-primary/70" />
                  <span>MRN: {patient.mrn}</span>
                </div>
                <div className="flex items-center mb-0.5 sm:mb-0">
                  <User className="h-3 w-3 mr-1 text-primary/70" />
                  <span>{patient.gender}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-1 md:mt-0 flex items-center text-muted-foreground text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
            <span className="truncate">Last updated: {formattedLastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
