
import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FinancialHistory } from "../types/stock";

interface StockChartProps {
  history: FinancialHistory[];
  title: string;
  description?: string;
}

type ChartType = 'line' | 'bar' | 'area';
type MetricType = 'eps' | 'revenue' | 'roe' | 'debtToEquity';

const metricLabels = {
  eps: 'EPS (IDR)',
  revenue: 'Revenue (T IDR)',
  roe: 'ROE (%)',
  debtToEquity: 'Debt to Equity'
};

const StockChart: React.FC<StockChartProps> = ({ 
  history, 
  title,
  description 
}) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [metric, setMetric] = useState<MetricType>('eps');

  const formatData = () => {
    return history.map(item => ({
      period: `${item.year} Q${item.quarter}`,
      [metric]: metric === 'revenue' ? item[metric] / 1_000_000_000_000 : item[metric]
    }));
  };

  const data = formatData();

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey={metric} 
              stroke="#1E3A8A" 
              strokeWidth={2} 
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={metric} fill="#0F766E" />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey={metric} 
              stroke="#1E3A8A"
              fill="#DBEAFE" 
            />
          </AreaChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex gap-2">
            <Select value={metric} onValueChange={(val) => setMetric(val as MetricType)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eps">EPS</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="roe">ROE</SelectItem>
                <SelectItem value="debtToEquity">Debt/Equity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(val) => setChartType(val as ChartType)}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="area">Area</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
