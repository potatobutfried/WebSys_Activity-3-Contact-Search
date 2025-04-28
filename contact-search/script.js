function searchContacts() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    
    // Show loading indicator
    resultsDiv.innerHTML = '';
    loadingDiv.classList.remove('d-none');
    
    // Fetch data from the JSON endpoint
    fetch('https://rm-afk.github.io/WebSysApi/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadingDiv.classList.add('d-none');
            
            if (!searchTerm) {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-info-circle"></i>
                        <h5>Please enter a name to search</h5>
                    </div>
                `;
                return;
            }
            
            // Convert single contact object to array for consistent processing
            const contacts = Array.isArray(data) ? data : [data];
            
            const filteredContacts = contacts.filter(contact => 
                contact.name.toLowerCase().includes(searchTerm)
            );
            
            displayResults(filteredContacts);
        })
        .catch(error => {
            loadingDiv.classList.add('d-none');
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle text-danger"></i>
                    <h5>Error loading contacts</h5>
                    <p class="text-muted">${error.message}</p>
                </div>
            `;
            console.error('Error fetching data:', error);
        });
}

function displayResults(contacts) {
    const resultsDiv = document.getElementById('results');
    
    if (contacts.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <i class="fas fa-user-slash"></i>
                <h5>No contacts found</h5>
                <p class="text-muted">Try a different search term</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <table class="table contact-table table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact Info</th>
                    <th>Address</th>
                    <th>Company</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    contacts.forEach(contact => {
        html += `
            <tr>
                <td>
                    <strong>${contact.name || 'N/A'}</strong>
                </td>
                <td>
                    ${contact.email ? `<div><i class="fas fa-envelope me-2 text-primary"></i> ${contact.email}</div>` : ''}
                    ${contact.phone ? `<div><i class="fas fa-phone me-2 text-primary"></i> ${contact.phone}</div>` : ''}
                </td>
                <td>
                    ${contact.address ? `
                    <div class="address-label"><i class="fas fa-map-marker-alt me-2 text-primary"></i> Address</div>
                    ${contact.address.street ? `<div>${contact.address.street}</div>` : ''}
                    ${contact.address.city || contact.address.state || contact.address.zip ? `
                    <div>${[contact.address.city, contact.address.state, contact.address.zip].filter(Boolean).join(', ')}</div>
                    ` : ''}
                    ` : '<div>No address available</div>'}
                </td>
                <td>
                    ${contact.company ? `
                    <div class="company-label"><i class="fas fa-building me-2 text-primary"></i> ${contact.company.name || 'N/A'}</div>
                    ${contact.company.position ? `<div>${contact.company.position}</div>` : ''}
                    ${contact.company.department ? `<div class="text-muted">${contact.company.department} Dept.</div>` : ''}
                    ` : '<div>No company information</div>'}
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    resultsDiv.innerHTML = html;
}


