import React, { useState } from 'react';
import {
  Box, Typography, Container, Paper, Grid, Card, CardContent, CardHeader,
  Button, Chip, Divider, List, ListItem, ListItemIcon, ListItemText,
  LinearProgress, ToggleButtonGroup, ToggleButton, Alert, IconButton,
  useTheme, alpha
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useThemeMode } from './Accessibility';

// Mock data for the given thingy idk 
const planFeatures = {
  starter: [
    { text: "5,000 chatbot requests/month", included: true },
    { text: "Basic analytics", included: true },
    { text: "Standard response times", included: true },
    { text: "Community support", included: true },
    { text: "API access", included: false },
    { text: "Custom branding", included: false },
  ],
  plus: [
    { text: "25,000 chatbot requests/month", included: true },
    { text: "Basic analytics", included: true },
    { text: "Standard response times", included: true },
    { text: "Community support", included: true },
    { text: "API access", included: true },
    { text: "Custom branding", included: true },
  ],
  enterprise: [
    { text: "Unlimited chatbot requests", included: true },
    { text: "Basic analytics", included: true },
    { text: "Standard response times", included: true },
    { text: "Community support", included: true },
    { text: "API access", included: true },
    { text: "Custom branding", included: true },
  ]
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Feature comparison component
const FeatureItem = ({ text, included }) => {
  return (
    <ListItem dense sx={{ py: 0.5, px: 0 }}>
      <ListItemIcon sx={{ minWidth: 36 }}>
        {included ? (
          <CheckIcon sx={{ color: 'success.main' }} fontSize="small" />
        ) : (
          <CloseIcon color="disabled" fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          variant: 'body2',
          fontWeight: included ? 500 : 400,
          color: included ? 'textPrimary' : 'text.disabled'
        }}
      />
    </ListItem>
  );
};

// Plan card component
const PlanCard = ({ plan, isCurrentPlan, onSelectPlan, billingCycle }) => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  // Determine if this is the highlighted plan
  const isHighlighted = plan.name === 'Plus';

  // Pricing based on billing cycle
  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  // Plan features
  const features = planFeatures[plan.id] || [];

  return (
    <Card
      elevation={isHighlighted ? 6 : 2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
        border: isHighlighted ? `2px solid ${theme.palette.primary.main}` : 'none',
        ...(isCurrentPlan && {
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
          borderStyle: 'solid'
        })
      }}
    >
      {/* Special tag for highlighted plan */}
      {isHighlighted && (
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: -32,
            transform: 'rotate(45deg)',
            bgcolor: theme.palette.primary.main,
            color: 'white',
            py: 0.5,
            px: 4,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            zIndex: 1
          }}
        >
          POPULAR
          POPULAR
        </Box>
      )}

      {/* Plan header */}
      <CardHeader
        title={
          <Typography variant="h5" component="h3" fontWeight="bold">
            {plan.name}
          </Typography>
        }
        subheader={
          <Box sx={{ mt: 1 }}>
            {isCurrentPlan && <Chip size="small" color="primary" label="Current Plan" sx={{ mb: 1 }} />}
            <Typography variant="body2" color="text.secondary">
              {plan.description}
            </Typography>
          </Box>
        }
        sx={{
          bgcolor: isHighlighted
            ? alpha(theme.palette.primary.main, isDark ? 0.15 : 0.05)
            : 'transparent',
          pb: 1
        }}
      />

      {/* Plan pricing */}
      <CardContent sx={{ pt: 1, flexGrow: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Typography
              variant="h3"
              component="span"
              fontWeight="bold"
              sx={{ lineHeight: 1 }}
            >
              ${price}
            </Typography>
            <Typography
              variant="subtitle1"
              component="span"
              color="text.secondary"
              sx={{ ml: 1, mb: 0.5 }}
            >
              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
            </Typography>
          </Box>

          {billingCycle === 'yearly' && (
            <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block', fontWeight: 500 }}>
              Save ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(2)} per year
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Plan features */}
        <List disablePadding sx={{ mb: 2 }}>
          {features.map((feature, idx) => (
            <FeatureItem
              key={idx}
              text={feature.text}
              included={feature.included}
            />
          ))}
        </List>
      </CardContent>

      <Divider />

      {/* Action button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant={isCurrentPlan || isHighlighted ? "contained" : "outlined"}
          color={isHighlighted ? "primary" : "inherit"}
          fullWidth
          onClick={() => onSelectPlan(plan.id)}
          size="large"
          disabled={isCurrentPlan}
          sx={{ py: 1.2 }}
        >
          {isCurrentPlan ? "Current Plan" : "Select Plan"}
        </Button>
      </Box>
    </Card>
  );
};

// Main component
const SubscriptionManagement = () => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  // State management
  const [currentPlan, setCurrentPlan] = useState('plus');  // starter, plus, enterprise
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showTrialBanner, setShowTrialBanner] = useState(true);

  // Mock Current Plan Data
  const currentPlanData = {
    starter: {
      name: 'Starter',
      requestLimit: 5000,
      requestsUsed: 3240,
      monthlyPrice: 0,
      yearlyPrice: 0,
      nextBillingDate: '2023-09-15',
      description: "Basic features for small teams",
    },
    plus: {
      name: 'Plus',
      requestLimit: 25000,
      requestsUsed: 16420,
      monthlyPrice: 99,
      yearlyPrice: 990,
      nextBillingDate: '2023-09-15',
      description: "Advanced features for growing businesses",
    },
    enterprise: {
      name: 'Enterprise',
      requestLimit: Infinity,
      requestsUsed: 78500,
      monthlyPrice: 499,
      yearlyPrice: 4990,
      nextBillingDate: '2023-09-15',
      description: "Full features with unlimited requests",
    }
  };

  // Plan options for comparison and upgrade
  const planOptions = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Basic features for small teams',
      monthlyPrice: 0,
      yearlyPrice: 0,
    },
    {
      id: 'plus',
      name: 'Plus',
      description: 'Advanced features for growing businesses',
      monthlyPrice: 99,
      yearlyPrice: 990,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Full features with unlimited requests',
      monthlyPrice: 499,
      yearlyPrice: 4990,
    }
  ];

  // Handle billing cycle change
  const handleBillingCycleChange = (event, newValue) => {
    if (newValue !== null) {
      setBillingCycle(newValue);
    }
  };

  // Handle plan selection
  const handleSelectPlan = (planId) => {
    if (planId === currentPlan) return;
    alert(`You selected the ${planId.toUpperCase()} plan!`);
  };

  return (
    <Box sx={{ width: '100%', pb: 8 }}>
      <Container maxWidth="xl">
        {/* Add breadcrumb navigation */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            Dashboard &gt; Subscription
          </Typography>
        </Box>
        
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Subscription & Billing
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your plan, track usage, and view billing information
          </Typography>
        </Box>

        {/* Trial Banner */}
        {showTrialBanner && (
          <Alert
            severity="warning"
            variant="outlined"
            icon={<WarningIcon />}
            sx={{ mb: 4 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowTrialBanner(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Your trial period ends in 7 days.
              </Typography>
              <Button
                variant="contained"
                size="small"
                color="warning"
                disableElevation
              >
                Upgrade Now
              </Button>
            </Box>
          </Alert>
        )}

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} lg={4}>
            {/* Current Plan Summary */}
            <Paper
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                mb: 4
              }}
            >
              <CardHeader
                title="Current Plan"
                sx={{
                  bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.light, 0.1),
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
              />

              <CardContent sx={{ pt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="h5" component="h3" fontWeight="bold">
                        {currentPlanData[currentPlan].name}
                      </Typography>
                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                        sx={{ ml: 1.5 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Billed {billingCycle === 'monthly' ? 'monthly' : 'annually'}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" fontWeight="bold">
                      ${billingCycle === 'monthly'
                        ? currentPlanData[currentPlan].monthlyPrice
                        : currentPlanData[currentPlan].yearlyPrice
                      }
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      per {billingCycle === 'monthly' ? 'month' : 'year'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CalendarIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Next billing date: {formatDate(currentPlanData[currentPlan].nextBillingDate)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                  Usage This Month
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      Chatbot Requests
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {currentPlanData[currentPlan].requestsUsed.toLocaleString()} /
                      {currentPlanData[currentPlan].requestLimit === Infinity
                        ? 'Unlimited'
                        : currentPlanData[currentPlan].requestLimit.toLocaleString()
                      }
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={
                      currentPlanData[currentPlan].requestLimit === Infinity
                        ? 50 // Just show 50% for unlimited
                        : Math.min((currentPlanData[currentPlan].requestsUsed / currentPlanData[currentPlan].requestLimit) * 100, 100)
                    }
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main'
                      }
                    }}
                  />
                </Box>

                <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                  Features Included
                </Typography>

                <List disablePadding sx={{ mb: 3 }}>
                  {planFeatures[currentPlan]
                    .filter(feature => feature.included)
                    .map((feature, idx) => (
                      <FeatureItem
                        key={idx}
                        text={feature.text}
                        included={true}
                      />
                    ))
                  }
                </List>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mb: 1 }}
                  onClick={() => {
                    // Find next plan tier
                    const planIndex = planOptions.findIndex(p => p.id === currentPlan);
                    if (planIndex < planOptions.length - 1) {
                      handleSelectPlan(planOptions[planIndex + 1].id);
                    }
                  }}
                  disabled={currentPlan === 'enterprise'}
                >
                  {currentPlan === 'enterprise' ? 'Highest Tier' : 'Upgrade Plan'}
                </Button>

                {currentPlan !== 'starter' && (
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    fullWidth
                  >
                    Cancel Subscription
                  </Button>
                )}
              </CardContent>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={8}>
            {/* Plan Comparison Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Available Plans
                </Typography>

                <ToggleButtonGroup
                  value={billingCycle}
                  exclusive
                  onChange={handleBillingCycleChange}
                  aria-label="billing cycle"
                  size="small"
                >
                  <ToggleButton value="monthly" aria-label="monthly billing">
                    Monthly
                  </ToggleButton>
                  <ToggleButton value="yearly" aria-label="yearly billing">
                    Yearly <Chip label="Save 20%" size="small" sx={{ ml: 0.5, height: 16 }} color="success" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Grid container spacing={3}>
                {planOptions.map((plan, index) => (
                  <Grid item xs={12} md={4} key={plan.id}>
                    <PlanCard
                      plan={plan}
                      isCurrentPlan={plan.id === currentPlan}
                      onSelectPlan={handleSelectPlan}
                      billingCycle={billingCycle}
                      index={index}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SubscriptionManagement;
