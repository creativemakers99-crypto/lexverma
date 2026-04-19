/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageLayout from './components/PageLayout';
import ScrollToTop from './components/ScrollToTop';
import BCIDisclaimer from './components/BCIDisclaimer';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminAdvocates from './pages/admin/AdminAdvocates';
import AdminReviews from './pages/admin/AdminReviews';
import AdminClients from './pages/admin/AdminClients';
import AdminCases from './pages/admin/AdminCases';
import AdminTasks from './pages/admin/AdminTasks';
import AdminCauseList from './pages/admin/AdminCauseList';
import AdminCaseDetail from './pages/admin/AdminCaseDetail';

import ClientLayout from './pages/portal/ClientLayout';
import ClientDashboard from './pages/portal/ClientDashboard';
import ClientCases from './pages/portal/ClientCases';
import ClientCaseDetail from './pages/portal/ClientCaseDetail';
import ClientDocuments from './pages/portal/ClientDocuments';
import ClientIntake from './pages/portal/ClientIntake';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import TeamProfile from './pages/TeamProfile';
import Advocates from './pages/Advocates';
import Testimonials from './pages/Testimonials';
import Career from './pages/Career';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import AIEvaluation from './pages/AIEvaluation';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <BCIDisclaimer />
      <Routes>
        <Route path="/portal" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="intake" element={<ClientIntake />} />
          <Route path="cases" element={<ClientCases />} />
          <Route path="cases/:caseId" element={<ClientCaseDetail />} />
          <Route path="documents" element={<ClientDocuments />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="cases" element={<AdminCases />} />
          <Route path="cases/:caseId" element={<AdminCaseDetail />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="causelist" element={<AdminCauseList />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="advocates" element={<AdminAdvocates />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>
        
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          {/* SEO Specific Landing Pages */}
          <Route path="services/:serviceId" element={<ServiceDetail />} />
          <Route path="services/:serviceId/in/:city" element={<ServiceDetail />} />
          
          <Route path="advocates" element={<Advocates />} />
          <Route path="team/:id" element={<TeamProfile />} />
          
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="career" element={<Career />} />
          <Route path="ai-evaluation" element={<AIEvaluation />} />
          <Route path="contact" element={<Contact />} />
          <Route path="booking" element={<Booking />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="blog" element={<Blog />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
