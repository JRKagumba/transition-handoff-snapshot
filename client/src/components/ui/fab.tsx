import React, { useState } from "react";
import { Plus, X, MicIcon, Camera, Pencil, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import { UserContext } from "@/lib/context";
import { useLocation } from "wouter";

type QuickAction = {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { selectedPatientId } = useContext(UserContext);
  const [location, setLocation] = useLocation();
  
  // Don't show on login page or form pages
  if (location === "/login" || location.includes("/form") || location.includes("/quick-capture")) {
    return null;
  }

  const quickActions: QuickAction[] = [
    {
      id: "voice-note",
      icon: <MicIcon className="h-5 w-5" />,
      label: "Voice Note",
      action: () => {
        toast({
          title: "Voice note recording",
          description: "Starting voice capture for patient notes...",
        });
        // Navigate to voice recording page
        setLocation(`/quick-capture/voice/${selectedPatientId}`);
      }
    },
    {
      id: "photo",
      icon: <Camera className="h-5 w-5" />,
      label: "Take Photo",
      action: () => {
        toast({
          title: "Camera access required",
          description: "Starting secure patient photo capture...",
        });
        // Navigate to photo capture page
        setLocation(`/quick-capture/photo/${selectedPatientId}`);
      }
    },
    {
      id: "micro-note",
      icon: <Pencil className="h-5 w-5" />,
      label: "Micro Note",
      action: () => {
        toast({
          title: "Quick note",
          description: "Add a brief note to expand later",
        });
        // Navigate to micro-note page
        setLocation(`/quick-capture/micro-note/${selectedPatientId}`);
      }
    },
    {
      id: "template",
      icon: <ClipboardList className="h-5 w-5" />,
      label: "Template",
      action: () => {
        toast({
          title: "Template selection",
          description: "Choose a template for structured data entry",
        });
        // Navigate to template selection page
        setLocation(`/quick-capture/template/${selectedPatientId}`);
      }
    }
  ];

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col-reverse items-end space-y-2 space-y-reverse">
      {isOpen && (
        <div className="flex flex-col-reverse gap-2 mb-2 items-end">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                action.action();
                setIsOpen(false);
              }}
              className="flex items-center bg-white shadow-lg rounded-full pl-3 pr-4 py-2 text-sm font-medium transition-all transform hover:scale-105"
            >
              <span className="bg-primary/10 p-1.5 mr-2 rounded-full">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={toggleFAB}
        className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-all duration-300 transform ${
          isOpen 
            ? "bg-destructive rotate-45" 
            : "bg-primary hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  );
};