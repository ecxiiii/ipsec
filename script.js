// IPsec Architecture Presentation - Interactive Navigation
(function() {
    'use strict';

    // Elements
    const slidesContainer = document.getElementById('slidesContainer');
    const slideNav = document.getElementById('slideNav');
    const slideCounter = document.getElementById('slideCounter');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const notesButton = document.getElementById('notesButton');
    const notesPanel = document.getElementById('notesPanel');
    const notesClose = document.getElementById('notesClose');
    const notesContent = document.getElementById('notesContent');

    // Get all slides
    const slides = Array.from(document.querySelectorAll('.slide'));
    const totalSlides = slides.length;
    let currentSlide = 0;
    let notesOpen = false;

    // Initialize
    function init() {
        createNavigationDots();
        updateSlideCounter();
        updateNavigationButtons();
        setupEventListeners();

        // Set initial slide
        goToSlide(0);
    }

    // Create navigation dots
    function createNavigationDots() {
        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slide-nav-dot');
            dot.setAttribute('data-slide', index);
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

            if (index === 0) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', () => goToSlide(index));
            slideNav.appendChild(dot);
        });
    }

    // Update slide counter
    function updateSlideCounter() {
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === totalSlides - 1;
    }

    // Update navigation dots
    function updateNavigationDots() {
        const dots = document.querySelectorAll('.slide-nav-dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= totalSlides) {
            return;
        }

        currentSlide = slideIndex;

        // Smooth scroll to slide
        const slideWidth = slides[slideIndex].offsetWidth;
        slidesContainer.scrollTo({
            left: slideWidth * slideIndex,
            behavior: 'smooth'
        });

        updateSlideCounter();
        updateNavigationButtons();
        updateNavigationDots();

        // Update notes content if panel is open
        if (notesOpen) {
            updateNotesContent(currentSlide);
        }
    }

    // Navigate to next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    // Navigate to previous slide
    function previousSlide() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Arrow buttons
        prevButton.addEventListener('click', previousSlide);
        nextButton.addEventListener('click', nextSlide);

        // Notes panel
        notesButton.addEventListener('click', toggleNotes);
        notesClose.addEventListener('click', closeNotes);

        // Close notes when clicking outside
        notesPanel.addEventListener('click', (e) => {
            if (e.target === notesPanel) {
                closeNotes();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyPress);

        // Scroll detection
        let scrollTimeout;
        slidesContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(detectCurrentSlide, 100);
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        slidesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        slidesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    previousSlide();
                }
            }
        }

        // Mouse wheel navigation (optional - can be disabled if too sensitive)
        let wheelTimeout;
        slidesContainer.addEventListener('wheel', (e) => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaX > 0 || e.deltaY > 0) {
                    nextSlide();
                } else if (e.deltaX < 0 || e.deltaY < 0) {
                    previousSlide();
                }
            }, 50);
        }, { passive: true });
    }

    // Handle keyboard navigation
    function handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
            case 'PageDown':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
            case 'n':
            case 'N':
                e.preventDefault();
                toggleNotes();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                // Prevent default vertical scrolling
                e.preventDefault();
                break;
        }
    }

    // Detect current slide based on scroll position
    function detectCurrentSlide() {
        const scrollLeft = slidesContainer.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        const detectedSlide = Math.round(scrollLeft / slideWidth);

        if (detectedSlide !== currentSlide && detectedSlide >= 0 && detectedSlide < totalSlides) {
            currentSlide = detectedSlide;
            updateSlideCounter();
            updateNavigationButtons();
            updateNavigationDots();
        }
    }

    // Prevent vertical scrolling
    document.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
            e.preventDefault();
        }
    }, { passive: false });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            goToSlide(currentSlide);
        }, 250);
    });

    // Add presentation mode functionality (fullscreen on F11 or double-click)
    document.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('slide') || e.target.closest('.slide')) {
            toggleFullscreen();
        }
    });

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Add help overlay (press '?' to show shortcuts)
    let helpOverlay = null;

    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !e.shiftKey) {
            e.preventDefault();
            showHelp();
        } else if (e.key === 'Escape') {
            if (helpOverlay) {
                hideHelp();
            } else if (notesOpen) {
                closeNotes();
            }
        }
    });

    function showHelp() {
        if (helpOverlay) return;

        helpOverlay = document.createElement('div');
        helpOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 14, 39, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        `;

        const helpContent = document.createElement('div');
        helpContent.style.cssText = `
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            max-width: 600px;
            color: var(--text-primary);
        `;

        helpContent.innerHTML = `
            <h2 style="color: var(--accent-cyan); margin-bottom: 1.5rem;">Keyboard Shortcuts</h2>
            <div style="display: grid; gap: 1rem;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">→ / Space / Page Down</span>
                    <span>Next slide</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">← / Page Up</span>
                    <span>Previous slide</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">Home</span>
                    <span>First slide</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">End</span>
                    <span>Last slide</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">N</span>
                    <span>Toggle presentation notes</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">F11</span>
                    <span>Fullscreen</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">Double-click</span>
                    <span>Toggle fullscreen</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">?</span>
                    <span>Show this help</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--accent-blue); font-weight: 600;">Esc</span>
                    <span>Close help / notes</span>
                </div>
            </div>
            <p style="margin-top: 1.5rem; text-align: center; color: var(--text-secondary); font-size: 0.9rem;">
                Press ESC to close
            </p>
        `;

        helpOverlay.appendChild(helpContent);
        document.body.appendChild(helpOverlay);

        helpOverlay.addEventListener('click', (e) => {
            if (e.target === helpOverlay) {
                hideHelp();
            }
        });
    }

    function hideHelp() {
        if (helpOverlay) {
            helpOverlay.remove();
            helpOverlay = null;
        }
    }

    // Add loading animation
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s';
            document.body.style.opacity = '1';
        }, 100);
    });

    // Presentation Notes Data
    const presentationNotes = {
        0: { // Slide 1: Title
            badge: 'intro',
            time: '30 seconds',
            purpose: 'Opening and context setting',
            talking_points: [
                'Welcome audience and introduce the topic',
                'IPsec Architecture - comprehensive technical framework',
                'This is a technical deep-dive, not basic overview',
                'Presentation covers all major components and protocols'
            ],
            delivery_tips: [
                'Keep introduction brief - audience wants technical content',
                'Set expectations: this is in-depth technical material',
                'Mention that questions are welcome throughout'
            ]
        },
        1: { // Slide 2: Executive Summary
            badge: 'intro',
            time: '1-2 minutes',
            purpose: 'High-level overview and roadmap',
            talking_points: [
                'IPsec operates at network layer (Layer 3) - transparent to applications',
                'Core protocols: AH provides authentication, ESP provides encryption',
                'Two modes: Transport (host-to-host) and Tunnel (network-to-network)',
                'IKE automates the complex key management process',
                'Modular cryptographic algorithm support'
            ],
            delivery_tips: [
                'This slide provides the roadmap - reference back to it as you progress',
                'Emphasize that IPsec is a suite, not a single protocol',
                'Mention that details will come in subsequent slides'
            ],
            reporting_guidance: 'When reporting: Focus on the comprehensive nature and the integration of multiple components working together.'
        },
        2: { // Slide 3: IPsec Overview
            badge: 'intro',
            time: '2 minutes',
            purpose: 'Core security services explained',
            talking_points: [
                '🔒 Confidentiality: Encryption ensures data privacy',
                '✓ Data Integrity: Tamper detection via cryptographic hashes',
                '🔑 Authentication: Verify peer identity (not just data origin)',
                '🛡️ Anti-replay: Sequence numbers prevent replay attacks',
                'All four services work together for comprehensive protection'
            ],
            delivery_tips: [
                'Use the four security pillars as a framework',
                'Give real-world examples: eavesdropping (confidentiality), MITM (integrity), impersonation (authentication), replay (anti-replay)',
                'Emphasize that these are not optional features - they\'re fundamental to IPsec design'
            ],
            reporting_guidance: 'Report these as the fundamental security guarantees. Mention that modern secure communications require all four.'
        },
        3: { // Slide 4: Architecture Components
            badge: 'technical',
            time: '2 minutes',
            purpose: 'Introduce the five fundamental building blocks',
            talking_points: [
                'Security Protocols (AH/ESP): The "what" - how packets are protected',
                'Security Associations: The "parameters" - defining how protection works',
                'Key Management (IKE): The "automation" - establishing secure channels',
                'Crypto Algorithms: The "flexibility" - supporting various security levels',
                'Policy Enforcement (Databases): The "control" - determining when/how to protect'
            ],
            delivery_tips: [
                'Present these as a layered architecture, not independent components',
                'Mention that we\'ll deep-dive into each component',
                'Use the numbered list to show there\'s a logical flow'
            ],
            reporting_guidance: 'When documenting architecture decisions, reference these five components and explain how each is implemented in your environment.'
        },
        4: { // Slide 5: Protocol Components
            badge: 'technical',
            time: '2-3 minutes',
            purpose: 'Component overview with key functions',
            talking_points: [
                'AH: Authentication only, NAT incompatible (rarely used now)',
                'ESP: Encryption + optional auth, NAT compatible (preferred)',
                'IKE: Automated negotiation (eliminates manual key configuration)',
                'SPD: Policy engine (protect/bypass/discard decisions)',
                'SAD: Active connection state (operational parameters)',
                'SA: Unidirectional security contract between peers'
            ],
            delivery_tips: [
                'Grid layout shows equal importance but explain ESP is most common',
                'Mention that older deployments may still use AH',
                'Emphasize automation via IKE vs manual configuration'
            ],
            reporting_guidance: 'In architecture documents, specify which protocols are used and why (e.g., "ESP chosen over AH for NAT compatibility").'
        },
        5: { // Slide 6: AH
            badge: 'technical',
            time: '2 minutes',
            purpose: 'Authentication Header deep-dive',
            talking_points: [
                'Protocol number 51 - recognized by all IP stacks',
                'Authenticates immutable IP header fields + payload',
                'SPI identifies which SA to use for verification',
                'Sequence numbers prevent replay attacks',
                'Key limitation: NAT incompatibility (breaks authentication)',
                'No confidentiality - everything in cleartext'
            ],
            delivery_tips: [
                'Explain why NAT breaks AH (header modification)',
                'Mention this is why ESP has largely superseded AH',
                'Emphasize the warning box - this is critical for planning'
            ],
            reporting_guidance: 'Report: "AH not recommended for modern deployments due to NAT incompatibility. ESP with authentication provides equivalent security with better compatibility."'
        },
        6: { // Slide 7: ESP
            badge: 'technical',
            time: '2-3 minutes',
            purpose: 'ESP protocol - the workhorse of IPsec',
            talking_points: [
                'Protocol number 50 - most widely deployed',
                'Three operational modes: encrypt-only, auth-only, both (recommended)',
                'NAT compatible - doesn\'t authenticate outer IP header',
                'Flexible: can do everything AH does plus encryption',
                'Modern deployments: always use ESP with both encryption and authentication'
            ],
            delivery_tips: [
                'Highlight the "Both ✓" card - this is best practice',
                'Explain why NAT compatibility matters in modern networks',
                'Mention that "null encryption" mode makes AH redundant'
            ],
            reporting_guidance: 'Standard recommendation: "Implement ESP with encryption and authentication enabled for optimal security and compatibility."'
        },
        7: { // Slide 8: IKE
            badge: 'technical',
            time: '2 minutes',
            purpose: 'Introduction to automated key management',
            talking_points: [
                'IKE eliminates manual key configuration (major operational benefit)',
                'Four primary functions: auth, key generation, negotiation, refresh',
                'Two-phase structure: Phase 1 (expensive DH) + Phase 2 (fast, can repeat)',
                'Phase 1 establishes secure channel, reused for multiple Phase 2 sessions',
                'This separation of concerns improves performance'
            ],
            delivery_tips: [
                'Emphasize the operational advantage: no manual key distribution',
                'Explain why two phases: expensive crypto once, fast negotiations many times',
                'Mention that Phase 1 can last hours/days, Phase 2 minutes'
            ],
            reporting_guidance: 'Highlight operational efficiency: "IKE automation reduces administrative overhead and enables regular key rotation."'
        },
        8: { // Slide 9: Transport Mode
            badge: 'technical',
            time: '2 minutes',
            purpose: 'Transport mode characteristics and use cases',
            talking_points: [
                'Protects payload only - original IP header visible',
                'Lower overhead - single IP header',
                'End-to-end security model',
                'Use case: host-to-host when both support IPsec',
                'Example: encrypted communication between two servers'
            ],
            delivery_tips: [
                'Use the packet structure diagram to visualize',
                'Explain when you would NOT use transport mode (gateways)',
                'Mention L2TP over IPsec as common transport mode usage'
            ],
            reporting_guidance: 'Specify in architecture docs: "Transport mode selected for host-to-host traffic to minimize overhead while maintaining end-to-end security."'
        },
        9: { // Slide 10: Tunnel Mode
            badge: 'technical',
            time: '2 minutes',
            purpose: 'Tunnel mode characteristics and primary use case',
            talking_points: [
                'Encapsulates entire original packet - creates new IP header',
                'Higher overhead but hides internal routing information',
                'Gateway-to-gateway model',
                'Primary use case: site-to-site VPNs',
                'Traffic analysis protection: only tunnel endpoints visible'
            ],
            delivery_tips: [
                'Compare packet structure to transport mode visually',
                'Explain why hiding internal IPs matters (security, privacy)',
                'Mention MTU considerations due to additional header'
            ],
            reporting_guidance: 'Standard for VPNs: "Tunnel mode provides network-to-network connectivity with traffic flow confidentiality."'
        },
        10: { // Slide 11: Mode Comparison
            badge: 'technical',
            time: '2 minutes',
            purpose: 'Decision framework for mode selection',
            talking_points: [
                'Table provides side-by-side comparison',
                'Key decision factors: endpoint support, overhead tolerance, use case',
                'Transport: both endpoints must support IPsec',
                'Tunnel: gateways can proxy for non-IPsec hosts',
                'Overhead vs visibility tradeoff'
            ],
            delivery_tips: [
                'Walk through each row systematically',
                'Give decision examples: "If connecting offices, tunnel. If server-to-server, transport."',
                'Mention that most VPN products default to tunnel mode'
            ],
            reporting_guidance: 'Document mode selection rationale in architecture decisions: justify choice based on requirements.'
        },
        11: { // Slide 12: SA Framework
            badge: 'technical',
            time: '2 minutes',
            purpose: 'Understanding Security Associations',
            talking_points: [
                'SA is a "contract" defining security parameters',
                'Critical concept: unidirectional (need 2 for bidirectional traffic)',
                'Nine key parameters define each SA',
                'Stored in SAD, referenced by SPI',
                'Lifetime-based: expire and get refreshed automatically'
            ],
            delivery_tips: [
                'Emphasize unidirectional nature - common source of confusion',
                'Explain that two SAs means two sets of keys',
                'Parameter grid shows complexity managed by IKE'
            ],
            reporting_guidance: 'Troubleshooting guidance: Check SA state in SAD when connectivity issues occur.'
        },
        12: { // Slide 13: Databases
            badge: 'technical',
            time: '3 minutes',
            purpose: 'Policy and state management databases',
            talking_points: [
                'SPD: Policy database - "what to do" (protect/bypass/discard)',
                'SAD: State database - "how to do it" (active SA parameters)',
                'PAD: Authorization database - "who can do it" (peer authorization)',
                'SPD consulted for every packet (performance critical)',
                'SAD lookup via SPI for inbound packets',
                'PAD prevents unauthorized SA establishment'
            ],
            delivery_tips: [
                'Explain the relationship: SPD defines intent, SAD tracks reality',
                'Mention that SPD is like a firewall ACL',
                'PAD often overlooked but critical for security'
            ],
            reporting_guidance: 'Security audit checklist: Review SPD policies, verify SAD state, validate PAD authorization rules.'
        },
        13: { // Slide 14: IKE Phase 1
            badge: 'technical',
            time: '3 minutes',
            purpose: 'Phase 1 establishment and modes',
            talking_points: [
                'Phase 1 establishes ISAKMP secure channel',
                'Three auth methods: PSK (simple), certificates (scalable), public key',
                'Main Mode: 6 messages, identity protected (preferred)',
                'Aggressive Mode: 3 messages, faster but identity exposed',
                'Diffie-Hellman exchange is expensive (why Phase 1 is long-lived)',
                'Result: secure channel for Phase 2 negotiations'
            ],
            delivery_tips: [
                'Explain why identity protection matters (reconnaissance)',
                'Mention PSK doesn\'t scale (shared secret problem)',
                'Certificates recommended for enterprise deployments'
            ],
            reporting_guidance: 'Security policy: "Main Mode with certificate-based authentication required for production deployments."'
        },
        14: { // Slide 15: IKE Phase 2
            badge: 'technical',
            time: '2-3 minutes',
            purpose: 'IPsec SA negotiation process',
            talking_points: [
                'Phase 2 runs within Phase 1 secure channel (protected)',
                'Quick Mode: 3 encrypted messages',
                'Negotiates actual IPsec parameters (protocol, algorithms, mode)',
                'Proxy IDs define protected traffic - must match on both sides',
                'PFS option: additional DH exchange for key independence',
                'Result: minimum 2 IPsec SAs (bidirectional traffic)'
            ],
            delivery_tips: [
                'Proxy ID mismatch is common troubleshooting issue',
                'PFS adds security but increases setup time',
                'Phase 2 can be repeated without re-doing Phase 1'
            ],
            reporting_guidance: 'Troubleshooting: "Phase 2 failures often due to proxy ID mismatch or algorithm incompatibility."'
        },
        15: { // Slide 16: IKEv1 vs IKEv2
            badge: 'technical',
            time: '2 minutes',
            purpose: 'Version comparison and recommendation',
            talking_points: [
                'IKEv1: Original, complex, widely deployed legacy',
                'IKEv2: Redesigned, simpler, more efficient',
                'Key improvements: fewer messages, built-in NAT-T, better reliability',
                'IKEv2 better for mobile/remote access scenarios',
                'Modern deployments should use IKEv2',
                'Legacy systems may still require IKEv1'
            ],
            delivery_tips: [
                'Emphasize green highlight on IKEv2 - this is the recommendation',
                'Mention backwards compatibility may require IKEv1 support',
                'IKEv2 has been standard since 2005 (RFC 4306)'
            ],
            reporting_guidance: 'Architecture standard: "IKEv2 required for new deployments. IKEv1 permitted only for legacy interoperability."'
        },
        16: { // Slide 17: Crypto Algorithms
            badge: 'technical',
            time: '3 minutes',
            purpose: 'Algorithm selection guidance',
            talking_points: [
                'AES: Best when hardware acceleration available (AES-NI)',
                'ChaCha20: Best for software-only implementations (mobile, embedded)',
                'Legacy algorithms (3DES, DES) must be avoided',
                'Authentication: SHA-256 minimum, avoid SHA-1 and MD5',
                'Poly1305 paired with ChaCha20 for integrated encryption+auth'
            ],
            delivery_tips: [
                'Explain hardware acceleration benefit: 10-100x faster',
                'Mobile devices often lack AES-NI - ChaCha20 performs better',
                'Red badges = security risk, avoid in production'
            ],
            reporting_guidance: 'Security baseline: "AES-256 or ChaCha20 for encryption; SHA-256 minimum for authentication. Legacy algorithms prohibited."'
        },
        17: { // Slide 18: DH Groups
            badge: 'technical',
            time: '2 minutes',
            purpose: 'Key exchange strength selection',
            talking_points: [
                'DH enables key establishment without prior shared secret',
                'Groups 1-2: Obsolete, broken by modern computing power',
                'Group 5: Minimum acceptable, but marginal',
                'Group 14 (2048-bit): Current standard for most deployments',
                'Groups 15-18: High security environments',
                'EC groups: Efficient alternative with smaller keys'
            ],
            delivery_tips: [
                'Color coding shows security level at a glance',
                'Explain that higher groups = more security but slower computation',
                'Mention that Group 14 is good balance of security/performance'
            ],
            reporting_guidance: 'Policy requirement: "DH Group 14 minimum. Groups 1, 2 disabled in all configurations."'
        },
        18: { // Slide 19: Outbound Processing
            badge: 'technical',
            time: '2-3 minutes',
            purpose: 'Packet flow for sending traffic',
            talking_points: [
                'Six-step process from packet generation to transmission',
                'SPD lookup first: determines if protection needed',
                'SAD lookup: find existing SA or trigger IKE',
                'IKE negotiation: automatic if no SA exists',
                'Encryption + authentication applied',
                'Final transmission with IPsec headers'
            ],
            delivery_tips: [
                'Walk through numbered steps sequentially',
                'Emphasize automation: IKE triggered automatically if needed',
                'Mention that SPD lookup happens for EVERY outbound packet'
            ],
            reporting_guidance: 'Performance consideration: SPD lookup optimization critical for high-throughput environments.'
        },
        19: { // Slide 20: Inbound Processing
            badge: 'technical',
            time: '2-3 minutes',
            purpose: 'Packet flow for receiving traffic',
            talking_points: [
                'Eight-step process from receipt to delivery',
                'Protocol identification: ESP (50) or AH (51)',
                'SAD lookup via SPI: find SA parameters',
                'Anti-replay check: verify sequence number',
                'Authentication verification: compute and compare ICV',
                'Decryption: using SA algorithms and keys',
                'SPD verification: ensure traffic matches policy',
                'Delivery to upper layers'
            ],
            delivery_tips: [
                'Emphasize security checks before decryption (auth first)',
                'SPD verification prevents unauthorized traffic injection',
                'Any failure in this chain = packet drop'
            ],
            reporting_guidance: 'Troubleshooting: Packet drops can occur at any of these 8 steps. Check logs for specific failure point.'
        },
        20: { // Slide 21: NAT Traversal
            badge: 'technical',
            time: '2 minutes',
            purpose: 'NAT compatibility challenges and solutions',
            talking_points: [
                'NAT modifies IP headers - breaks AH authentication',
                'ESP more NAT-friendly but still has issues',
                'IKE port 500 may be blocked by some NAT devices',
                'NAT-T solution: auto-detect NAT, encapsulate ESP in UDP',
                'UDP port 4500 used for NAT-T encapsulation',
                'Keep-alive packets maintain NAT mappings'
            ],
            delivery_tips: [
                'Explain why this matters: NAT is ubiquitous in modern networks',
                'This is why ESP has superseded AH',
                'NAT-T is automatic in modern implementations'
            ],
            reporting_guidance: 'Deployment note: "NAT-T enabled by default. UDP port 4500 must be permitted through firewalls."'
        },
        21: { // Slide 22: Performance Factors
            badge: 'implementation',
            time: '2 minutes',
            purpose: 'Implementation performance considerations',
            talking_points: [
                'Hardware acceleration dramatically improves crypto performance',
                'MTU reduction due to IPsec overhead (plan for fragmentation)',
                'Mode selection impacts overhead (transport < tunnel)',
                'Phase 1 DH expensive, but amortized over time',
                'Performance tuning: long SA lifetimes reduce rekeying overhead'
            ],
            delivery_tips: [
                'Give performance numbers if available (e.g., "AES-NI: 10x faster")',
                'MTU issues cause subtle problems - mention importance of PMTU discovery',
                'Balance security (short lifetimes) vs performance (long lifetimes)'
            ],
            reporting_guidance: 'Capacity planning: Factor in 10-15% overhead for tunnel mode, 5-10% for transport mode.'
        },
        22: { // Slide 23: Best Practices
            badge: 'implementation',
            time: '3 minutes',
            purpose: 'Security implementation checklist',
            talking_points: [
                'Algorithm selection: use modern crypto only',
                'Key management: leverage IKE automation',
                'Policy configuration: least-privilege principle',
                'Operations: monitoring, patching, testing',
                'This slide is a security checklist for deployments'
            ],
            delivery_tips: [
                'Each category has actionable items',
                'Green checkmarks indicate verified practices',
                'Use this as a security audit checklist'
            ],
            reporting_guidance: 'Compliance documentation: "IPsec deployment adheres to industry best practices per security framework."'
        },
        23: { // Slide 24: Deployment Scenarios
            badge: 'implementation',
            time: '2-3 minutes',
            purpose: 'Common real-world use cases',
            talking_points: [
                'Site-to-Site: Most common, connects branch offices',
                'Remote Access: Mobile workforce, WFH scenarios',
                'Host-to-Host: Server-to-server, datacenter use',
                'Hybrid Cloud: On-premises to cloud connectivity',
                'Each scenario has different requirements and constraints'
            ],
            delivery_tips: [
                'Give concrete examples from your environment',
                'Icons help visualize the topology',
                'Mention that multiple scenarios can coexist'
            ],
            reporting_guidance: 'Architecture documentation: Specify which scenarios apply to your deployment and why each was chosen.'
        },
        24: { // Slide 25: Conclusion
            badge: 'summary',
            time: '2 minutes',
            purpose: 'Summary and key takeaways',
            talking_points: [
                'IPsec is mature, standardized, and foundational',
                'Layered architecture: policy → state → automation',
                'Comprehensive security: all four pillars integrated',
                'Performance: hardware acceleration enables high throughput',
                'Flexibility: supports diverse deployment scenarios',
                'Essential knowledge for network security professionals'
            ],
            delivery_tips: [
                'Icons provide visual memory anchors',
                'Emphasize "foundational" - this is core infrastructure',
                'Transition to Q&A or next topic'
            ],
            reporting_guidance: 'Executive summary: "IPsec provides enterprise-grade network security with proven interoperability and performance."'
        },
        25: { // Slide 26: References
            badge: 'summary',
            time: '30 seconds',
            purpose: 'Citation and further reading',
            talking_points: [
                'Key references listed for deep-dive study',
                'RFC 4301 is the authoritative architecture specification',
                'Mix of academic, vendor, and community resources',
                'Full reference list in accompanying markdown document'
            ],
            delivery_tips: [
                'Don\'t read through all references - they\'re for later',
                'Mention RFC 4301 as primary specification',
                'Offer to share presentation and references'
            ],
            reporting_guidance: 'Technical documentation: Include RFC citations for compliance and audit purposes.'
        }
    };

    // Notes Panel Functions
    function openNotes() {
        notesOpen = true;
        notesPanel.classList.add('open');
        updateNotesContent(currentSlide);
    }

    function closeNotes() {
        notesOpen = false;
        notesPanel.classList.remove('open');
    }

    function toggleNotes() {
        if (notesOpen) {
            closeNotes();
        } else {
            openNotes();
        }
    }

    function updateNotesContent(slideIndex) {
        const notes = presentationNotes[slideIndex];

        if (!notes) {
            notesContent.innerHTML = '<p>No notes available for this slide.</p>';
            return;
        }

        let html = `
            <div class="notes-section">
                <span class="notes-badge ${notes.badge}">${notes.badge.toUpperCase()}</span>
                <div class="time-estimate">⏱️ ${notes.time}</div>

                <h4>📋 Purpose</h4>
                <p>${notes.purpose}</p>

                <h5>💡 Key Talking Points</h5>
                <ul>
                    ${notes.talking_points.map(point => `<li>${point}</li>`).join('')}
                </ul>

                ${notes.delivery_tips ? `
                    <div class="notes-tip">
                        <strong>💬 Delivery Tips</strong>
                        <ul>
                            ${notes.delivery_tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${notes.reporting_guidance ? `
                    <div class="notes-warning">
                        <strong>📊 Reporting Guidance</strong>
                        <p>${notes.reporting_guidance}</p>
                    </div>
                ` : ''}
            </div>
        `;

        notesContent.innerHTML = html;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
        transition: width 0.3s ease;
        z-index: 10001;
    `;
    document.body.appendChild(progressBar);

    function updateProgress() {
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Update progress on slide change
    const originalGoToSlide = goToSlide;
    goToSlide = function(slideIndex) {
        originalGoToSlide(slideIndex);
        updateProgress();
    };

    // Preload hint
    const preloadHint = document.createElement('div');
    preloadHint.style.cssText = `
        position: fixed;
        bottom: 5rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        padding: 0.75rem 1.5rem;
        border-radius: 20px;
        color: var(--text-secondary);
        font-size: 0.9rem;
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.5s;
    `;
    preloadHint.textContent = 'Press ? for keyboard shortcuts';
    document.body.appendChild(preloadHint);

    // Hide hint after 5 seconds
    setTimeout(() => {
        preloadHint.style.opacity = '0';
        setTimeout(() => {
            preloadHint.remove();
        }, 500);
    }, 5000);

})();
