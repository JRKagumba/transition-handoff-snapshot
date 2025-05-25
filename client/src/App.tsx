import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Overview from "@/pages/overview";
import SafetyEnvironmentalPage from "@/pages/safety-environmental";
import DischargeReadinessPage from "@/pages/discharge-readiness";
import ClinicalInformationPage from "@/pages/clinical-information";
import LoginPage from "@/pages/login";
import PatientProfilePage from "@/pages/patient-profile";
import Header from "@/components/layout/Header";
import PatientHeader from "@/components/layout/PatientHeader";
import TabNavigation from "@/components/layout/TabNavigation";
import Footer from "@/components/layout/Footer";
import SafetyForm from "@/pages/forms/safety-form";
import PatientContextForm from "@/pages/forms/patient-context-form";
import DischargeForm from "@/pages/forms/discharge-form";
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/lib/context";
import { useToast } from "@/hooks/use-toast";


// Patient selector component
function PatientSelector() {
  const { selectedPatientId, setSelectedPatientId } = useContext(UserContext);
  const [showSelector, setShowSelector] = useState(false);
  
  return (
    <div className="flex items-center">
      <Button 
        variant="outline" 
        className="ml-4"
        onClick={() => setShowSelector(!showSelector)}
      >
        Patient {selectedPatientId} ▼
      </Button>
      
      {showSelector && (
        <div className="absolute mt-2 top-16 right-4 bg-white shadow-lg rounded-md p-2 border z-50">
          <div className="py-1 font-medium px-2">Select Patient</div>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
            <div 
              key={id}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer rounded ${selectedPatientId === id ? 'bg-primary/10 font-medium' : ''}`}
              onClick={() => {
                setSelectedPatientId(id);
                setShowSelector(false);
              }}
            >
              Patient {id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Simple FAB component
function QuickActionFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { selectedPatientId } = useContext(UserContext);
  const [, navigate] = useLocation();
  
  const quickActions = [
    {
      id: "note",
      icon: "📝",
      label: "Quick Note",
      action: () => {
        toast({
          title: "Quick note",
          description: "Add a brief note to expand later",
        });
        setIsOpen(false);
      }
    },
    {
      id: "photo",
      icon: "📷",
      label: "Take Photo",
      action: () => {
        toast({
          title: "Photo capture",
          description: "Photo capture will be available soon",
        });
        setIsOpen(false);
      }
    },
    {
      id: "voice",
      icon: "🎤",
      label: "Voice Note",
      action: () => {
        toast({
          title: "Voice note",
          description: "Voice recording will be available soon",
        });
        setIsOpen(false);
      }
    },
    {
      id: "template",
      icon: "📋",
      label: "Template",
      action: () => {
        toast({
          title: "Template",
          description: "Template selection will be available soon",
        });
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col-reverse items-end space-y-2 space-y-reverse">
      {isOpen && (
        <div className="flex flex-col-reverse gap-2 mb-2 items-end">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="flex items-center bg-white shadow-lg rounded-full pl-3 pr-4 py-2 text-sm font-medium transition-all transform hover:scale-105"
            >
              <span className="bg-primary/10 p-1.5 mr-2 rounded-full">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-all duration-300 transform ${
          isOpen 
            ? "bg-destructive rotate-45" 
            : "bg-primary hover:scale-105"
        }`}
      >
        {isOpen ? "✕" : "+" }
      </button>
    </div>
  );
}

function AppRouter() {
  const [location, navigate] = useLocation();
  const isFormPage = location.includes("/form");
  const { currentUser, setCurrentUser, setIsLoginOpen } = useContext(UserContext);
  const { toast } = useToast();
  
  // Check if we're on the login page
  const isLoginPage = location === "/login";
  
  // Handle sign out
  const handleSignOut = () => {
    setCurrentUser(null);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/login");
  };
  
  // Protect routes if not logged in
  useEffect(() => {
    if (!currentUser && !isLoginPage) {
      navigate("/login");
    }
  }, [currentUser, isLoginPage, navigate]);
  
  if (isLoginPage) {
    return <LoginPage />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header>
        <div className="flex items-center ml-auto">
          {currentUser && <PatientSelector />}
          {currentUser ? (
            <div className="ml-4 bg-white shadow rounded-md px-3 py-1.5 flex items-center">
              <div className="mr-2">
                <div className="font-medium text-sm">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground">{currentUser.role}</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Switch
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              className="ml-4"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          )}
        </div>
      </Header>
      {!isFormPage && <PatientHeader />}
      {!isFormPage && <TabNavigation />}
      <main className="flex-grow relative">
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={Overview} />
          <Route path="/patient-profile/:id" component={PatientProfilePage} />
          <Route path="/safety-environmental" component={SafetyEnvironmentalPage} />
          <Route path="/discharge-readiness" component={DischargeReadinessPage} />
          <Route path="/clinical-information" component={ClinicalInformationPage} />
          {/* Quick capture routes - to be implemented later */}
          <Route path="/form/safety/:id" component={SafetyForm} />
          <Route path="/form/patient-context/:id" component={PatientContextForm} />
          <Route path="/form/discharge/:id" component={DischargeForm} />
          <Route component={NotFound} />
        </Switch>
        
        {/* Show FAB only when user is logged in and not on login or form pages */}
        {currentUser && !isLoginPage && !isFormPage && (
          <QuickActionFAB />
        )}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // State for user context
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string; role: string } | null>({
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Physician"
  });
  const [selectedPatientId, setSelectedPatientId] = useState(1);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Create context value
  const contextValue = {
    currentUser,
    setCurrentUser,
    selectedPatientId,
    setSelectedPatientId,
    isLoginOpen,
    setIsLoginOpen
  };

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={contextValue}>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
