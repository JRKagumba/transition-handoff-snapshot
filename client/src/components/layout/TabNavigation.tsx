import { Link, useLocation } from "wouter";
import { UserContext } from "@/lib/context";
import { useContext } from "react";
import { User, CircleUser, Shield, ClipboardCheck, FileText, Stethoscope, Clock, FileHeart } from "lucide-react";

const TabNavigation = () => {
  const [location] = useLocation();
  const { selectedPatientId } = useContext(UserContext);

  const tabs = [
    { name: "Overview", path: "/", icon: <User className="w-4 h-4 mr-1" /> },
    { name: "Patient Profile", path: `/patient-profile/${selectedPatientId}`, icon: <CircleUser className="w-4 h-4 mr-1" /> },
    { name: "Clinical", path: "/clinical-information", icon: <Stethoscope className="w-4 h-4 mr-1" /> },
    { name: "Safety", path: "/safety-environmental", icon: <Shield className="w-4 h-4 mr-1" /> },
    { name: "Discharge", path: "/discharge-readiness", icon: <ClipboardCheck className="w-4 h-4 mr-1" /> },
  ];

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 w-full">
          {tabs.map((tab) => {
            const isActive = 
              (tab.path === "/" && location === "/") || 
              (tab.path !== "/" && location.startsWith(tab.path));
              
            return (
              <Link 
                key={tab.path} 
                href={tab.path}
                className={`px-1 sm:px-3 py-2.5 text-sm font-medium whitespace-nowrap flex flex-col xs:flex-row justify-center items-center transition-all duration-200 ${
                  isActive 
                    ? "bg-primary/10 text-primary border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                }`}
              >
                <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                  {tab.icon}
                </div>
                <span className="text-xs xs:text-sm xs:ml-1.5 mt-1 xs:mt-0">
                  {tab.name === "Patient Profile" ? "Profile" : tab.name}
                </span>
                {isActive && (
                  <div className="hidden xs:block ml-1.5 h-1 w-1 rounded-full bg-primary"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
