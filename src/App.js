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
    
    return `<!DOCTYPE html>
<html>
<head>
  <title>${form.name}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdn.form.io/js/formio.full.min.css">
  <style>
    .formio-container {
      width: ${width};
      max-width: ${maxWidth};
      margin: 20px auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    ${embedSettings.customCSS}
    @media (max-width: ${embedSettings.responsiveBreakpoint}px) {
      .formio-container {
        width: 95%;
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="formio-container">
    ${embedSettings.showTitle ? `<h2>${form.name}</h2>` : ''}
    <div id="formio-${form.id}"></div>
  </div>
  
  <script src="https://cdn.form.io/js/formio.full.min.js"></script>
  <script>
    Formio.setBaseUrl('https://forms.onlydans.ai');
    Formio.createForm(document.getElementById('formio-${form.id}'), 'https://forms.onlydans.ai/${form.path}')
      .then(form => {
        console.log('Form loaded successfully');
        form.on('submit', submission => {
          console.log('Form submitted:', submission);
        });
      })
      .catch(error => {
        console.error('Form loading failed:', error);
      });
  </script>
</body>
</html>`;
  };

  const generateQuickEmbed = (form) => {
    return `<script>
  (function() {
    var div = document.createElement('div');
    div.style.maxWidth = '${embedSettings.width === 'responsive' ? '600px' : embedSettings.width + 'px'}';
    div.style.margin = '20px auto';
    div.style.padding = '20px';
    div.id = 'formio-${form.id}';
    document.currentScript.parentNode.insertBefore(div, document.currentScript);
    
    var script = document.createElement('script');
    script.src = 'https://cdn.form.io/js/formio.full.min.js';
    script.onload = function() {
      Formio.setBaseUrl('https://forms.onlydans.ai');
      Formio.createForm(div, 'https://forms.onlydans.ai/${form.path}');
    };
    document.head.appendChild(script);
  })();
</script>`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center">
        <Icon className={`h-8 w-8 text-${color}-500 mr-3`} />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={BarChart3} 
          title="Total Forms" 
          value={forms.length} 
          subtitle="Active forms"
        />
        <StatCard 
          icon={Eye} 
          title="Total Views" 
          value={forms.reduce((sum, f) => sum + f.views, 0)} 
          subtitle="This month"
          color="green"
        />
        <StatCard 
          icon={Share2} 
          title="Submissions" 
          value={forms.reduce((sum, f) => sum + f.submissions, 0)} 
          subtitle="Total collected"
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{form.name}</div>
                      <div className="text-sm text-gray-500">/{form.path}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{form.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{form.submissions}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      form.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {form.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => {setSelectedForm(form); setActiveTab('embed');}}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => window.open(`https://forms.onlydans.ai/${form.path}`, '_blank')}
                      className="text-green-600 hover:text-green-900"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const FormBuilder = () => {
    useEffect(() => {
      // Load Form.io builder when component mounts
      const script = document.createElement('script');
      script.src = 'https://cdn.form.io/js/formio.full.min.js';
      script.onload = () => {
        if (window.Formio) {
          window.Formio.builder(document.getElementById('builder'), {}, {
            builder: {
              basic: false,
              advanced: false,
              data: false,
              layout: false,
              premium: false
            }
          }).then(builder => {
            setBuilderForm(builder);
            
            builder.on('change', schema => {
              console.log('Form schema changed:', schema);
              // Here you could auto-save to your Form.io instance
            });
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup
        const builderElement = document.getElementById('builder');
        if (builderElement) {
          builderElement.innerHTML = '';
        }
      };
    }, []);

    const saveForm = async () => {
      if (builderForm) {
        const schema = builderForm.schema;
        const formName = prompt('Enter form name:');
        
        if (formName) {
          // In real app, save to Form.io API
          console.log('Saving form:', formName, schema);
          
          // Mock adding to forms list
          const newForm = {
            id: formName.toLowerCase().replace(/\s+/g, '-'),
            name: formName,
            path: formName.toLowerCase().replace(/\s+/g, '-'),
            submissions: 0,
            views: 0,
            lastModified: new Date().toISOString().split('T')[0],
            status: 'draft'
          };
          
          setForms([...forms, newForm]);
          alert('Form saved successfully!');
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Form Builder</h2>
            <div className="space-x-3">
              <button 
                onClick={() => {
                  if (builderForm) {
                    builderForm.form = {};
                  }
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                New Form
              </button>
              <button 
                onClick={saveForm}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Form
              </button>
            </div>
          </div>
          
          <div 
            id="builder" 
            className="border border-gray-300 rounded-md"
            style={{ minHeight: '600px' }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Components</h4>
              <ul className="space-y-1">
                <li>• Text Field - Single line input</li>
                <li>• Text Area - Multi-line input</li>
                <li>• Email - Email validation</li>
                <li>• Select - Dropdown options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Advanced Features</h4>
              <ul className="space-y-1">
                <li>• Conditional Logic - Show/hide fields</li>
                <li>• File Upload - Accept documents/images</li>
                <li>• Data Sources - Connect to APIs</li>
                <li>• Validation Rules - Custom validation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmbedGenerator = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Selection</h2>
        <select 
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={selectedForm?.id || ''}
          onChange={(e) => setSelectedForm(forms.find(f => f.id === e.target.value))}
        >
          <option value="">Select a form...</option>
          {forms.map(form => (
            <option key={form.id} value={form.id}>{form.name}</option>
          ))}
        </select>
      </div>

      {selectedForm && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Embed Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={embedSettings.width}
                  onChange={(e) => setEmbedSettings({...embedSettings, width: e.target.value})}
                >
                  <option value="400">400px (Narrow)</option>
                  <option value="600">600px (Medium)</option>
                  <option value="800">800px (Wide)</option>
                  <option value="responsive">Responsive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Breakpoint</label>
                <input 
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={embedSettings.responsiveBreakpoint}
                  onChange={(e) => setEmbedSettings({...embedSettings, responsiveBreakpoint: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    checked={embedSettings.showTitle}
                    onChange={(e) => setEmbedSettings({...embedSettings, showTitle: e.target.checked})}
                  />
                  <span className="text-sm font-medium text-gray-700">Show form title</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Embed Codes</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Complete HTML Page</h3>
                  <button 
                    onClick={() => copyToClipboard(generateEmbedCode(selectedForm))}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </button>
                </div>
                <textarea 
                  className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
                  value={generateEmbedCode(selectedForm)}
                  readOnly
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Quick Embed Script</h3>
                  <button 
                    onClick={() => copyToClipboard(generateQuickEmbed(selectedForm))}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </button>
                </div>
                <textarea 
                  className="w-full h-24 p-3 border border-gray-300 rounded-md font-mono text-sm"
                  value={generateQuickEmbed(selectedForm)}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Public URLs</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direct Form URL</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50"
                    value={`https://forms.onlydans.ai/${selectedForm.path}`}
                    readOnly
                  />
                  <button 
                    onClick={() => copyToClipboard(`https://forms.onlydans.ai/${selectedForm.path}`)}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shareable Landing Page</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50"
                    value={`https://yoursite.com/forms/${selectedForm.path}`}
                    readOnly
                  />
                  <button 
                    onClick={() => copyToClipboard(`https://yoursite.com/forms/${selectedForm.path}`)}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">You can set up this custom domain to host your forms</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Form.io Management Dashboard</h1>
            <div className="text-sm text-gray-600">forms.onlydans.ai</div>
          </div>
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('builder')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'builder' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Form Builder
            </button>
            <button 
              onClick={() => setActiveTab('embed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'embed' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Embed Generator
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'builder' && <FormBuilder />}
        {activeTab === 'embed' && <EmbedGenerator />}
      </div>
    </div>
  );
};

export default FormioManagementDashboard;
