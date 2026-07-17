import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, Link } from '@react-pdf/renderer';

// Register fonts if needed, or rely on built-in standard PDF fonts
// (Times-Roman, Times-Italic, Helvetica, Courier)

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    width: 1000,
    height: 700,
    position: 'relative',
    fontFamily: 'Helvetica',
  },
  outerGoldBorder: {
    position: 'absolute',
    top: 16, left: 16, right: 16, bottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  innerGoldBorder: {
    position: 'absolute',
    top: 18, left: 18, right: 18, bottom: 18,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  header: {
    position: 'absolute',
    top: 40, left: 48, right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B2046',
  },
  logoSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: '8 16',
    borderRadius: 8,
  },
  badgeLeft: {
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingRight: 16,
    marginRight: 16,
    alignItems: 'flex-end',
  },
  badgeRight: {
    flexDirection: 'column',
  },
  badgeLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  badgeValue: {
    fontSize: 12,
    color: '#0B2046',
  },
  leftSidebar: {
    position: 'absolute',
    top: 200, left: 48,
    width: 200,
  },
  sidebarItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  sidebarItemLabel: {
    fontSize: 10,
    color: '#0B2046',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sidebarItemValue: {
    fontSize: 13,
    color: '#374151',
  },
  rightSidebar: {
    position: 'absolute',
    top: 180, right: 48,
    width: 200,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  verifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifiedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  scanLabel: {
    fontSize: 10,
    color: '#0B2046',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scanDesc: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  scanLink: {
    color: '#2563eb',
    fontSize: 8,
  },
  qrCodeBox: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  qrCodeImg: {
    width: 102,
    height: 102,
  },
  credIdBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 4,
  },
  credIdText: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
  },
  centerContent: {
    position: 'absolute',
    top: 95, left: 260, right: 260,
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 48,
    color: '#0B2046',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goldLine: {
    width: 60,
    height: 1,
    backgroundColor: '#D4AF37',
  },
  goldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    marginHorizontal: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  ribbon: {
    backgroundColor: '#0B2046',
    padding: '4 20',
    marginBottom: 12,
  },
  ribbonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  studentName: {
    fontFamily: 'Times-Italic',
    fontSize: 56,
    color: '#0B2046',
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
    textAlign: 'center',
  },
  eventNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B2046',
    marginBottom: 4,
    textAlign: 'center',
  },
  eventDetailsText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  signaturesArea: {
    position: 'absolute',
    bottom: 80, left: 260, right: 260,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureBlock: {
    width: 180,
    alignItems: 'center',
  },
  signatureNameCursive: {
    fontFamily: 'Times-Italic',
    fontSize: 32,
    color: '#0B2046',
    marginBottom: 4,
    textAlign: 'center',
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#9ca3af',
    marginBottom: 8,
  },
  signatureNameText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0B2046',
    textAlign: 'center',
    marginBottom: 2,
  },
  signatureTitleText: {
    fontSize: 8,
    color: '#6b7280',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  goldSealContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldSealOuter: {
    width: 90, height: 90,
    borderRadius: 45,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldSealInner: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: '#0B2046',
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealText: {
    fontSize: 6,
    color: '#D4AF37',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 24, left: 48, right: 48,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    justifyContent: 'space-between',
  },
  footerCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerColBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 16,
  },
  footerLabel: {
    fontSize: 8,
    color: '#0B2046',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 9,
    color: '#4b5563',
  },
  bottomWarning: {
    position: 'absolute',
    bottom: 4,
    width: '100%',
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
  }
});

interface ReactPdfCertificateProps {
  data?: Record<string, string>;
  credentialId: string;
  transactionHash?: string;
  verificationTime?: string;
  qrDataUrl?: string;
}

export const ReactPdfCertificate: React.FC<ReactPdfCertificateProps> = ({
  data,
  credentialId,
  transactionHash,
  verificationTime,
  qrDataUrl,
}) => {
  const safeData = data || {};
  
  const title = safeData.title || "CERTIFICATE";
  const subtitle = safeData.subtitle || "OF PARTICIPATION";
  const presentedToText = safeData.presentedTo || "PROUDLY PRESENTED TO";
  const studentName = safeData.name || "[Candidate Name]";
  const description = safeData.description || "for successfully participating in";
  const eventName = safeData.eventName || "Blockchain & Web3 Workshop";
  const eventDetails = safeData.eventDetails || "An insightful session covering the fundamentals of Blockchain, Smart Contracts, and Web3 Development.";
  const dateStr = safeData.date || "May 18, 2025";
  const organizer = safeData.issuerName || "Stellar Developers Community";
  
  const sig1Name = safeData.signature1Name || "Rohit Verma";
  const sig1Title = safeData.signature1Title || "COMMUNITY LEAD";
  
  const sig2Name = safeData.signature2Name || "Sneha Iyer";
  const sig2Title = safeData.signature2Title || "EVENT COORDINATOR";

  const truncatedHash = transactionHash 
    ? `${transactionHash.substring(0, 20)}...${transactionHash.substring(transactionHash.length - 20)}`
    : "PENDING ON-CHAIN CONFIRMATION...";

  return (
    <Document>
      <Page size={[1000, 700]} style={styles.page}>
        <View style={styles.outerGoldBorder} />
        <View style={styles.innerGoldBorder} />

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View>
              <Text style={styles.logoTitle}>CertifyX</Text>
              <Text style={styles.logoSubtitle}>Issue. Verify. Trust.</Text>
            </View>
          </View>
          <View style={styles.badgeContainer}>
            <View style={styles.badgeLeft}>
              <Text style={styles.badgeLabel}>CERTIFICATE ID</Text>
              <Text style={styles.badgeValue}>{credentialId || "CX-2025"}</Text>
            </View>
            <View style={styles.badgeRight}>
              <Text style={styles.badgeLabel}>VERIFIED ON</Text>
              <Text style={styles.badgeValue}>STELLAR BLOCKCHAIN</Text>
            </View>
          </View>
        </View>

        <View style={styles.leftSidebar}>
          <View style={styles.sidebarItem}>
            <View>
              <Text style={styles.sidebarItemLabel}>DATE OF ISSUE</Text>
              <Text style={styles.sidebarItemValue}>{dateStr}</Text>
            </View>
          </View>
          <View style={styles.sidebarItem}>
            <View>
              <Text style={styles.sidebarItemLabel}>DURATION</Text>
              <Text style={styles.sidebarItemValue}>6 Hours</Text>
            </View>
          </View>
          <View style={styles.sidebarItem}>
            <View>
              <Text style={styles.sidebarItemLabel}>MODE</Text>
              <Text style={styles.sidebarItemValue}>Online</Text>
            </View>
          </View>
          <View style={styles.sidebarItem}>
            <View>
              <Text style={styles.sidebarItemLabel}>EVENT ORGANIZED BY</Text>
              <Text style={styles.sidebarItemValue}>{organizer}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSidebar}>
          <View style={styles.verifiedHeader}>
            <Text style={styles.verifiedText}>VERIFIED</Text>
          </View>
          <Text style={styles.scanLabel}>SCAN TO VERIFY</Text>
          <Text style={styles.scanDesc}>
            Scan to view blockchain record{"\n"}
            <Link src={`https://stellar.expert/explorer/testnet${transactionHash ? `/tx/${transactionHash}` : ''}`} style={styles.scanLink}>
              stellar.expert
            </Link>
          </Text>
          <View style={styles.qrCodeBox}>
            {qrDataUrl ? <Image source={qrDataUrl} style={styles.qrCodeImg} /> : null}
          </View>
          <Text style={styles.scanLabel}>OR ENTER CREDENTIAL ID</Text>
          <View style={styles.credIdBox}>
            <Text style={styles.credIdText}>{credentialId}</Text>
          </View>
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.mainTitle}>{title}</Text>
          <View style={styles.subtitleRow}>
            <View style={styles.goldLine} />
            <View style={styles.goldDot} />
            <Text style={styles.subtitleText}>{subtitle}</Text>
            <View style={styles.goldDot} />
            <View style={styles.goldLine} />
          </View>
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>{presentedToText}</Text>
          </View>
          <Text style={styles.studentName}>{studentName}</Text>
          <View style={styles.goldLine} />
          <Text style={styles.descriptionText}>{description}</Text>
          <Text style={styles.eventNameText}>{eventName}</Text>
          <Text style={styles.eventDetailsText}>{eventDetails}</Text>
        </View>

        <View style={styles.signaturesArea}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureNameCursive}>{sig1Name}</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureNameText}>{sig1Name.toUpperCase()}</Text>
            <Text style={styles.signatureTitleText}>{sig1Title.toUpperCase()}</Text>
          </View>
          
          <View style={styles.goldSealContainer}>
            <View style={styles.goldSealOuter}>
              <View style={styles.goldSealInner}>
                <Text style={styles.sealText}>CERTIFIED &</Text>
                <Text style={styles.sealText}>BLOCKCHAIN</Text>
                <Text style={styles.sealText}>VERIFIED</Text>
              </View>
            </View>
          </View>

          <View style={styles.signatureBlock}>
            <Text style={styles.signatureNameCursive}>{sig2Name}</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureNameText}>{sig2Name.toUpperCase()}</Text>
            <Text style={styles.signatureTitleText}>{sig2Title.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <View>
              <Text style={styles.footerLabel}>BLOCKCHAIN TRANSACTION</Text>
              <Text style={styles.footerValue}>{truncatedHash}</Text>
            </View>
          </View>
          <View style={[styles.footerCol, styles.footerColBorder]}>
            <View>
              <Text style={styles.footerLabel}>DATE OF ISSUE</Text>
              <Text style={styles.footerValue}>{verificationTime || dateStr}</Text>
            </View>
          </View>
          <View style={[styles.footerCol, styles.footerColBorder]}>
            <View>
              <Text style={styles.footerLabel}>NETWORK</Text>
              <Text style={styles.footerValue}>Stellar Testnet</Text>
            </View>
          </View>
        </View>

        <Text style={styles.bottomWarning}>
          This certificate is secured on the Stellar blockchain and cannot be altered or tampered with.
        </Text>
      </Page>
    </Document>
  );
};
