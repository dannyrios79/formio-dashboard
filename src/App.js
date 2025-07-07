import React, { useState, useEffect } from 'react';
import { Copy, Eye, Settings, BarChart3, Globe, Code, Palette, Share2, ExternalLink } from 'lucide-react';

const FormioManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedForm, setSelectedForm] = useState(null);
  const [builderForm, setBuilderForm] = useState(null);
  const [embedSettings, setEmbedSettings] = useState({
    width: '600',
    responsiveBreakpoint: '768',
    theme: 'default',
    showTitle: true,
    customCSS: ''
  });

  // Mock data - in real app this would come from Form.io API
  const [forms, setForms] = useState([
    {
      id: 'test',
      name: 'Contact Form',
      path: 'test',
      submissions: 23,
      views: 145,
      lastModified: '2025-01-06',
      status: 'published'
    },
    {
      id: 'newsletter',
      name: 'Newsletter Signup', 
      path: 'newsletter',
      submissions: 67,
      views: 289,
      lastModified: '2025-01-05',
      status: 'published'
    },
    {
      id: 'feedback',
      name: 'Customer Feedback',
      path: 'feedback', 
      submissions: 12,
      views: 78,
      lastModified: '2025-01-04',
      status: 'draft'
    }
  ]);

  const generateEmbedCode = (form) => {
    const responsive = embedSettings.width === 'responsive';
    const width = responsive ? '100%' : `${embedSettings.width}px`;
    const maxWidth = responsive ? '600px' : embedSettings.width + 'px';
    
    re
