import React, { useState } from 'react';
import ContactList from './ContactList';
import ContactDetail from './ContactDetail';

const ContactManager = () => {
    const [view, setView] = useState('list'); // list, detail
    const [selectedContact, setSelectedContact] = useState(null);

    const handleViewContact = (contact) => {
        setSelectedContact(contact);
        setView('detail');
    };

    const handleBack = () => {
        setSelectedContact(null);
        setView('list');
    };

    return (
        <div className="h-full">
            {view === 'list' ? (
                <ContactList onView={handleViewContact} />
            ) : (
                <ContactDetail contact={selectedContact} onBack={handleBack} />
            )}
        </div>
    );
};

export default ContactManager;
