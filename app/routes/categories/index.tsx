import { useState } from "react";
import { Link } from "react-router";
import { RequireAuth } from "~/components/auth/components/auth-provider";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { UnderConstruction } from "~/components/common/under-construction";
import type { Route } from "../+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Categories | WinFin" },
    { name: "description", content: "Manage your spending and budget categories" },
  ];
}

export default function CategoriesPage() {
  const [selectedTab, setSelectedTab] = useState<'expenses' | 'income' | 'sources' | 'spendingTypes'>('expenses');
  
  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage your expense categories, income sources, and more
            </p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="tabs tabs-boxed mb-6 bg-base-200">
          <button 
            className={`tab ${selectedTab === 'expenses' ? 'tab-active' : ''}`} 
            onClick={() => setSelectedTab('expenses')}
          >
            Expense Categories
          </button>
          <button 
            className={`tab ${selectedTab === 'income' ? 'tab-active' : ''}`} 
            onClick={() => setSelectedTab('income')}
          >
            Income Categories
          </button>
          <button 
            className={`tab ${selectedTab === 'sources' ? 'tab-active' : ''}`} 
            onClick={() => setSelectedTab('sources')}
          >
            Financial Sources
          </button>
          <button 
            className={`tab ${selectedTab === 'spendingTypes' ? 'tab-active' : ''}`} 
            onClick={() => setSelectedTab('spendingTypes')}
          >
            Spending Types
          </button>
        </div>
        
        {/* Tab Content */}
        <FancyCard className="p-6">
          {selectedTab === 'expenses' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
              <UnderConstruction message="Expense categories management is coming soon!" />
            </div>
          )}
          
          {selectedTab === 'income' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Income Categories</h2>
              <UnderConstruction message="Income categories management is coming soon!" />
            </div>
          )}
          
          {selectedTab === 'sources' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Financial Sources</h2>
              <UnderConstruction message="Financial sources management is coming soon!" />
            </div>
          )}
          
          {selectedTab === 'spendingTypes' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Spending Types</h2>
              <UnderConstruction message="Spending types management is coming soon!" />
            </div>
          )}
        </FancyCard>
      </div>
    </RequireAuth>
  );
}