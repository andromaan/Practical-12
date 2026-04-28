import { useState } from "react";
import "../styles/pages.css";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function AddressBook() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 000-0000",
    },
  ]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const addContact = () => {
    if (formData.name.trim() && formData.email.trim()) {
      setContacts([
        ...contacts,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
      setFormData({ name: "", email: "", phone: "" });
    }
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <div className="page-container">
      <h1>Address Book</h1>

      <div className="form-card">
        <h2 style={{ marginTop: 0 }}>Add New Contact</h2>

        <div className="form-field">
          <label htmlFor="contact-name">Name:</label>
          <input
            id="contact-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full name"
            className="input-full"
          />
        </div>

        <div className="form-field">
          <label htmlFor="contact-email">Email:</label>
          <input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="email@example.com"
            className="input-full"
          />
        </div>

        <div className="form-field">
          <label htmlFor="contact-phone">Phone:</label>
          <input
            id="contact-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+1 (555) 000-0000"
            className="input-full"
          />
        </div>

        <button onClick={addContact} className="btn-success btn-add-contact">
          Add Contact
        </button>
      </div>

      <div className="contacts-list">
        <h2>Contacts ({contacts.length})</h2>
        {contacts.length === 0 ? (
          <p className="empty-state">
            No contacts yet. Add one to get started!
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td data-label="Name">
                      <strong>{contact.name}</strong>
                    </td>
                    <td data-label="Email">
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </td>
                    <td data-label="Phone">
                      {contact.phone ? (
                        <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
                          {contact.phone}
                        </a>
                      ) : (
                        <span className="text-secondary">—</span>
                      )}
                    </td>
                    <td data-label="Action">
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="btn-danger btn-small btn-delete"
                        aria-label={`Delete contact: ${contact.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
