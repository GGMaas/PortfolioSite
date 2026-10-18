async function getVisitorInfo() {
  const response = await fetch('http://ip-api.com/json/?fields=status,country,city,timezone,query');  
  if (!response.ok) throw new Error(`Status: ${response.status}`);
  
  const data = await response.json();
  
  if (data.status === 'fail') {
    throw new Error('API couldnt determine location');
  }

  return data; 
}

function buildWidgetHeading(titleText) {
  const heading = document.createElement('div');
  heading.className = 'visitor-widget-heading';

  const icon = document.createElement('span');
  icon.className = 'visitor-widget-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '!';

  const title = document.createElement('span');
  title.textContent = titleText;

  heading.append(icon, title);
  return heading;
}

function buildVisitorWidget(info) {
  const container = document.createElement('div');
  container.className = 'visitor-widget';

  const ipDetails = document.createElement('div');
  const ipLabel = document.createElement('p');
  ipLabel.className = 'visitor-widget-label';
  ipLabel.textContent = 'Your special Public IP address';

  const {ip, copyStatus } = copy_IP_ForUser(info);

  const location = document.createElement('p');
  location.className = 'visitor-widget-location';
  location.textContent = `${info.city}, ${info.country}`;

  ipDetails.append(ipLabel, ip, copyStatus);
  container.append(buildWidgetHeading('You(r) visit'), ipDetails, location);
  return container;
}

function copy_IP_ForUser(info) {
  const ip = document.createElement('button');
  ip.type = 'button';
  ip.className = 'visitor-widget-ip';
  ip.textContent = info.query;
  ip.setAttribute('aria-label', `Copy IP address ${info.query}`);

  const copyStatus = document.createElement('p');
  copyStatus.className = 'visitor-widget-copy-status';
  copyStatus.setAttribute('aria-live', 'polite');
  copyStatus.textContent = 'Click for copy!.';

  ip.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(info.query);
      copyStatus.textContent = 'IP address copied.';
    } catch (error) {
      copyStatus.textContent = 'Could not copy. Check clipboard permissions.';
      console.error('Could not copy visitor IP address:', error);
    }
  });

  return { ip, copyStatus };
}

function buildVisitorStatus(titleText, message) {
  const container = document.createElement('div');
  container.className = 'visitor-widget';

  const status = document.createElement('p');
  status.className = 'visitor-widget-status';
  status.textContent = message;

  container.append(buildWidgetHeading(titleText), status);
  return container;
}

async function initWidget() {
  const container = document.getElementById('visitorInfo-widget-container');
  if (!container) return;

  container.replaceChildren(
    buildVisitorStatus('Your visit', 'Finding your approximate location...')
  );

  try {
    const data = await getVisitorInfo(); 
    
    container.replaceChildren(buildVisitorWidget(data));

  } catch (error) {
    container.replaceChildren(
      buildVisitorStatus('Location unavailable', 'Visitor details could not be loaded.')
    );
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', initWidget);