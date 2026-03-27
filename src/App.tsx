import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import PartyBusFleet from "./pages/PartyBusFleet";
import LimoFleet from "./pages/LimoFleet";
import VehicleDetail from "./pages/VehicleDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AreasWeServe from "./pages/AreasWeServe";
import AreaDetail from "./pages/AreaDetail";
import CharterBuses from "./pages/CharterBuses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chicago-party-bus-rental" element={<PartyBusFleet />} />
            <Route path="/chicago-party-bus-rental/:slug" element={<VehicleDetail />} />
            <Route path="/chicago-limo-rental" element={<LimoFleet />} />
            <Route path="/chicago-limo-rental/:slug" element={<VehicleDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/areas-we-serve" element={<AreasWeServe />} />
            <Route path="/areas-we-serve/:slug" element={<AreaDetail />} />
            <Route path="/charter-buses" element={<CharterBuses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
