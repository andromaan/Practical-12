import { useState } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function AddressBook() {
  const [contacts, setContacts] = useState<Contact[]>([{ id: 1, name: "John Doe", email: "john@example.com", phone: "+1 (555) 000-0000" }]);
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Address Book</h1>

      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Add New Contact</h2>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full name"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Email:
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="email@example.com"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Phone:
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+1 (555) 000-0000"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={addContact}
          style={{
            padding: "8px 16px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Contact
        </button>
      </div>

      <div>
        <h2>Contacts ({contacts.length})</h2>
        {contacts.length === 0 ? (
          <p style={{ color: "#999" }}>
            No contacts yet. Add one to get started!
          </p>
        ) : (
          <div>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                style={{
                  padding: "15px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 8px 0" }}>{contact.name}</h3>
                    <p style={{ margin: "4px 0", color: "#666" }}>
                      📧 {contact.email}
                    </p>
                    {contact.phone && (
                      <p style={{ margin: "4px 0", color: "#666" }}>
                        📱 {contact.phone}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    style={{
                      padding: "4px 8px",
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
