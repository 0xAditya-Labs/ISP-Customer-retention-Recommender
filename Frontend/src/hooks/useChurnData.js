import { useState, useCallback, useMemo } from 'react';
import { API_BASE_URL } from '../config';

export function useChurnData(token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedIds, setCompletedIds] = useState(new Set());

  // Feature 1: Row-level feedback and status
  const [feedbackMap, setFeedbackMap] = useState({});
  const [statusMap, setStatusMap] = useState({});

  // Feature 3: ROI slider assumptions
  const [successRate, setSuccessRate] = useState(25);
  const [costPerCall, setCostPerCall] = useState(200);

  const runAnalysis = useCallback(async (file) => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);
    setFeedbackMap({});
    setStatusMap({});

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/predict-churn`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        setData({
          roi_metrics: result.roi_metrics,
          action_plan: result.action_plan
        });
      } else {
        throw new Error("Analysis failed on the server.");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const toggleCompleted = useCallback((customerId) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(customerId)) {
        next.delete(customerId);
      } else {
        next.add(customerId);
      }
      return next;
    });
  }, []);

  const setFeedback = useCallback((customerId, text) => {
    setFeedbackMap((prev) => ({ ...prev, [customerId]: text }));
  }, []);

  const setFinalStatus = useCallback((customerId, status) => {
    setStatusMap((prev) => ({ ...prev, [customerId]: status }));
    // Auto-mark as done when status changes from Pending
    if (status !== 'Pending') {
      setCompletedIds((prev) => {
        const next = new Set(prev);
        next.add(customerId);
        return next;
      });
    } else {
      // If reverted to Pending, un-mark
      setCompletedIds((prev) => {
        const next = new Set(prev);
        next.delete(customerId);
        return next;
      });
    }
  }, []);

  // Feature 3: Dynamic ROI recalculation
  const computedMetrics = useMemo(() => {
    if (!data) return null;

    const usersCalled = data.roi_metrics.users_called;
    const campaignCost = usersCalled * costPerCall;
    const usersSaved = Math.round(usersCalled * (successRate / 100));

    // Revenue per saved user from original backend data
    const originalRevenueSaved = data.roi_metrics.revenue_saved;
    const originalUsersSaved = data.roi_metrics.users_saved;
    const revenuePerSavedUser = originalUsersSaved > 0
      ? originalRevenueSaved / originalUsersSaved
      : 0;
    const revenueSaved = Math.round(usersSaved * revenuePerSavedUser);
    const netRoi = revenueSaved - campaignCost;

    return {
      users_called: usersCalled,
      users_saved: usersSaved,
      campaign_cost: campaignCost,
      revenue_saved: revenueSaved,
      net_roi: netRoi,
    };
  }, [data, successRate, costPerCall]);

  // Feature 2: Export to CSV
  const exportCSV = useCallback(() => {
    if (!data) return;

    const headers = [
      'Customer ID',
      'Phone',
      'Revenue at Risk',
      'Churn Probability',
      'Top Churn Driver',
      'Suggested Action',
      'Feedback/Notes',
      'Final Status',
    ];

    const rows = data.action_plan.map((item) => [
      item.customerID,
      item.phone || 'N/A',
      item.clv_proxy,
      item.Churn_Probability,
      `"${item.Top_Churn_Driver}"`,
      `"${item.Suggested_Action}"`,
      `"${feedbackMap[item.customerID] || ''}"`,
      statusMap[item.customerID] || 'Pending',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'retention_campaign_results.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [data, feedbackMap, statusMap]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setCompletedIds(new Set());
    setFeedbackMap({});
    setStatusMap({});
    setSuccessRate(25);
    setCostPerCall(200);
  }, []);

  return {
    data,
    loading,
    error,
    completedIds,
    feedbackMap,
    statusMap,
    successRate,
    costPerCall,
    computedMetrics,
    runAnalysis,
    toggleCompleted,
    setFeedback,
    setFinalStatus,
    setSuccessRate,
    setCostPerCall,
    exportCSV,
    reset,
  };
}
