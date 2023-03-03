const fs = require('fs');
const axios = require('axios');

const apiKey = 'paste your api here';

const domainFile = 'domain.txt';
const domains = fs.readFileSync(domainFile, 'utf-8').split('\n').filter(Boolean);

for (let domain of domains) {
  checkAvailability(domain)
    .then(available => console.log(`${domain} is ${available ? '\x1b[32mavailable!\x1b[0m' : '\x1b[31munavailable!\x1b[0m'}`))
    .catch(error => console.error(`Error with domain: ${domain}: ${error.message}`));
}

function checkAvailability(domain) {
  const url = `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${domain}`;
  return axios.get(url)
    .then(response => {
      const data = response.data.DomainInfo;
      if (data.domainAvailability === 'AVAILABLE') {
        return true;
      } else if (data.domainAvailability === 'UNAVAILABLE') {
        return false;
      } else {
        throw new Error(`ERROR ${data.domainAvailability}`);
      }
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(`Error with domain: ${domain} ${error.response.data.message}`);
      } else {
        throw new Error(`Error with domain: ${domain} ${error.message}`);
      }
    });
}
