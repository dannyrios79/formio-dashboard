import React, { useState, useEffect, useRef } from 'react';
import { Copy, Eye, Settings, BarChart3, Globe, Code, Palette, Share2, ExternalLink, Edit } from 'lucide-react';

const FormioManagementDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedForm, setSelectedForm] = useState(null);
    const [formToEdit, setFormToEdit] = useState(null);
    const [builderInstance, setBuilderInstance] = useState(null);
    const [styledUrl, setStyledUrl] = useState('');
    const [embedSettings, setEmbedSettings] = useState({
        width: '600',
        responsiveBreakpoint: '768',
        theme: 'default',
        showTitle: true,
        customCSS: `/* Custom CSS for your form */
.formio-component-textfield input {
    border-radius: 5px;
    border-color: #6B7280;
}
.btn-primary {
    background-color: #3B82F6;
    border: none;
}
.btn-primary:hover {
    background-color: #2563EB;
}`
    });

    // Ref to hold the form schema for the builder
    const formSchemaRef = useRef({});

    // Mock data - in a real app this would come from the Form.io API
    const [forms, setForms] = useState([
        {
            id: 'contact',
            name: 'Contact Form',
            path: 'contact',
            submissions: 23,
            views: 145,
            lastModified: '2025-01-06',
            status: 'published',
            schema: {
                components: [
                    { type: 'textfield', key: 'firstName', label: 'First Name', input: true },
                    { type: 'textfield', key: 'lastName', label: 'Last Name', input: true },
                    { type: 'email', key: 'email', label: 'Email', input: true },
                    { type: 'textarea', key: 'message', label: 'Message', input: true },
                    { type: 'button', action: 'submit', label: 'Submit', theme: 'primary' }
                ]
            }
        },
        {
            id: 'newsletter',
            name: 'Newsletter Signup',
            path: 'newsletter',
            submissions: 67,
            views: 289,
            lastModified: '2025-01-05',
            status: 'published',
            schema: {
                components: [
                    { type: 'email', key: 'email', label: 'Email Address', placeholder: 'Enter your email', input: true },
                    { type: 'button', action: 'submit', label: 'Subscribe', theme: 'primary' }
                ]
            }
        },
        {
            id: 'feedback',
            name: 'Customer Feedback',
            path: 'feedback',
            submissions: 12,
            views: 78,
            lastModified: '2025-01-04',
            status: 'draft',
            schema: {
                components: [
                    { type: 'select', label: 'Rating', key: 'rating', data: { values: [{label: 'Excellent', value: 'excellent'}, {label: 'Good', value: 'good'}, {label: 'Poor', value: 'poor'}] }, input: true },
                    { type: 'textarea', key: 'comments', label: 'Comments', input: true },
                    { type: 'button', action: 'submit', label: 'Send Feedback', theme: 'primary' }
                ]
            }
        }
    ]);
    
    // When a form is selected for embedding, update the styled URL
    useEffect(() => {
        if (selectedForm) {
            const htmlContent = generateEmbedCode(selectedForm);
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            setStyledUrl(url);
    
            // Cleanup blob URL on component unmount or when form changes
            return () => URL.revokeObjectURL(url);
        }
    }, [selectedForm, embedSettings]);


    const handleEditForm = (form) => {
        setFormToEdit(form);
        formSchemaRef.current = form.schema || {};
        setActiveTab('builder');
    };

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
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: #f3f4f6;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
    }
    .formio-container {
      width: ${width};
      max-width: ${maxWidth};
      margin: 20px;
      padding: 25px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      background-color: #fff;
    }
    /* Custom User Styles */
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
        return `<div id="formio-container-${form.id}"></div>
<script src="https://cdn.form.io/js/formio.full.min.js"></script>
<script>
  (function() {
    var container = document.getElementById('formio-container-${form.id}');
    var customStyles = document.createElement('style');
    customStyles.innerHTML = \`${embedSettings.customCSS}\`;
    document.head.appendChild(customStyles);
    Formio.setBaseUrl('https://forms.onlydans.ai');
    Formio.createForm(container, 'https://forms.onlydans.ai/${form.path}');
  })();
</script>`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
            <div className="flex items-center">
                <Icon className={`h-8 w-8 text-${color}-500 mr-4`} />
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>
            </div>
        </div>
    );
    
    const Dashboard = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={BarChart3} 
                    title="Total Forms" 
                    value={forms.length} 
                    subtitle="Active and draft forms"
                    color="blue"
                />
                <StatCard 
                    icon={Eye} 
                    title="Total Views" 
                    value={forms.reduce((sum, f) => sum + f.views, 0).toLocaleString()} 
                    subtitle="Across all forms"
                    color="green"
                />
                <StatCard 
                    icon={Share2} 
                    title="Submissions" 
                    value={forms.reduce((sum, f) => sum + f.submissions, 0).toLocaleString()} 
                    subtitle="Total collected"
                    color="purple"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
                    <button onClick={() => { setFormToEdit(null); formSchemaRef.current={}; setActiveTab('builder'); }} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Create New Form
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats (Views / Subs)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{form.views} / {form.submissions}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${form.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {form.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button onClick={() => handleEditForm(form)} className="text-gray-500 hover:text-blue-600" title="Edit Form">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => {setSelectedForm(form); setActiveTab('embed');}} className="text-gray-500 hover:text-green-600" title="Embed & Share">
                                            <Code className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => window.open(`https://forms.onlydans.ai/${form.path}`, '_blank')} className="text-gray-500 hover:text-purple-600" title="View Live Form">
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
            const scriptId = 'formio-builder-script';
            let script = document.getElementById(scriptId);

            const initializeBuilder = () => {
                if (window.Formio && document.getElementById('builder')) {
                    // **FIX: Enabled standard builder components**
                    window.Formio.builder(document.getElementById('builder'), formSchemaRef.current, {
                        builder: {
                            basic: true, // Enabled
                            advanced: true, // Enabled
                            data: true, // Enabled
                            layout: true, // Enabled
                            premium: false, // Keep disabled for community edition
                            customBasic: {
                                title: 'Basic Components',
                                default: true,
                                weight: 0,
                                components: {
                                    textfield: true,
                                    textarea: true,
                                    number: true,
                                    password: true,
                                    checkbox: true,
                                    selectboxes: true,
                                    select: true,
                                    radio: true,
                                    button: true,
                                }
                            }
                        }
                    }).then(builder => {
                        setBuilderInstance(builder);
                        builder.on('change', schema => {
                            // The form schema is available in builder.schema
                            // You can auto-save here if needed
                        });
                    });
                }
            };
    
            if (!script) {
                script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://cdn.form.io/js/formio.full.min.js';
                script.onload = initializeBuilder;
                document.head.appendChild(script);
            } else {
                initializeBuilder();
            }
    
            return () => {
                if (builderInstance) {
                    builderInstance.destroy(true);
                }
            };
        }, [formToEdit]); // Re-initialize builder when formToEdit changes
    
        const saveForm = async () => {
            if (builderInstance) {
                const schema = builderInstance.schema;
                
                if (formToEdit) {
                    // Update existing form
                    const updatedForms = forms.map(f => f.id === formToEdit.id ? { ...f, name: schema.title || f.name, schema: schema, lastModified: new Date().toISOString().split('T')[0] } : f);
                    setForms(updatedForms);
                    alert('Form updated successfully!');
                    setActiveTab('dashboard');
                } else {
                    // Save new form
                    const formName = prompt('Enter form name:', 'My New Form');
                    if (formName) {
                        const newForm = {
                            id: formName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
                            name: formName,
                            path: formName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
                            submissions: 0,
                            views: 0,
                            lastModified: new Date().toISOString().split('T')[0],
                            status: 'draft',
                            schema: schema
                        };
                        setForms([...forms, newForm]);
                        alert('Form saved successfully!');
                        setActiveTab('dashboard');
                    }
                }
            }
        };

        const clearBuilder = () => {
            setFormToEdit(null);
            formSchemaRef.current = {};
            if (builderInstance) {
                builderInstance.form = {};
            }
        }
    
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">{formToEdit ? `Editing: ${formToEdit.name}` : "Create New Form"}</h2>
                        <div className="space-x-3">
                            <button onClick={clearBuilder} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                                Clear
                            </button>
                            <button onClick={saveForm} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                {formToEdit ? 'Update Form' : 'Save Form'}
                            </button>
                        </div>
                    </div>
                    
                    <div id="builder" className="border border-gray-300 rounded-md p-2" style={{ minHeight: '700px' }}/>
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
                    <option value="">Select a form to embed...</option>
                    {forms.map(form => (
                        <option key={form.id} value={form.id}>{form.name}</option>
                    ))}
                </select>
            </div>

            {selectedForm && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Settings */}
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Embed & Style Settings</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Breakpoint (px)</label>
                                <input 
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={embedSettings.responsiveBreakpoint}
                                    onChange={(e) => setEmbedSettings({...embedSettings, responsiveBreakpoint: e.target.value})}
                                />
                            </div>
                            <label className="flex items-center space-x-2">
                                <input 
                                    type="checkbox"
                                    checked={embedSettings.showTitle}
                                    onChange={(e) => setEmbedSettings({...embedSettings, showTitle: e.target.checked})}
                                />
                                <span className="text-sm font-medium text-gray-700">Show form title</span>
                            </label>
                            
                            {/* NEW: Custom CSS Editor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
                                <textarea
                                    className="w-full h-48 p-3 border border-gray-300 rounded-md font-mono text-sm"
                                    value={embedSettings.customCSS}
                                    onChange={(e) => setEmbedSettings({ ...embedSettings, customCSS: e.target.value })}
                                    placeholder="Enter your custom CSS here..."
                                />
                            </div>
                        </div>

                        {/* Right Column: URLs & Preview */}
                        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Share & Embed</h2>
                            {/* NEW: Self-Hosted Styled URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Self-Hosted Styled URL</label>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="text"
                                        className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50"
                                        value={styledUrl}
                                        readOnly
                                    />
                                    <button onClick={() => copyToClipboard(styledUrl)} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" title="Copy URL">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    <a href={styledUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600" title="Open in New Tab">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">A shareable link to a standalone page with your custom styles.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Direct Form URL (Unstyled)</label>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="text"
                                        className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50"
                                        value={`https://forms.onlydans.ai/${selectedForm.path}`}
                                        readOnly
                                    />
                                    <button onClick={() => copyToClipboard(`https://forms.onlydans.ai/${selectedForm.path}`)} className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600" title="Copy URL">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Embed Codes</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Full HTML Page</h3>
                                    <button onClick={() => copyToClipboard(generateEmbedCode(selectedForm))} className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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
                                    <button onClick={() => copyToClipboard(generateQuickEmbed(selectedForm))} className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
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
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Form.io Dashboard</h1>
                        <div className="text-sm text-gray-600">forms.onlydans.ai</div>
                    </div>
                    <nav className="flex space-x-8">
                        {['dashboard', 'builder', 'embed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`capitalize py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                {tab === 'embed' ? 'Embed & Share' : tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'builder' && <FormBuilder />}
                {activeTab === 'embed' && <EmbedGenerator />}
            </main>
        </div>
    );
};

export default FormioManagementDashboard;
