import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Package, TrendingUp, Award } from "lucide-react";
// Mock top products data
const products = [
  {
    name: "Wireless Earbuds",
    sales: 1245,
    revenue: 124500,
    growth: 15.2,
    inventory: 78,
  },
  {
    name: "Smart Watch",
    sales: 986,
    revenue: 197200,
    growth: 12.8,
    inventory: 45,
  },
  {
    name: "Phone Case",
    sales: 743,
    revenue: 22290,
    growth: 8.5,
    inventory: 124,
  },
  {
    name: "Bluetooth Speaker",
    sales: 652,
    revenue: 52160,
    growth: 6.2,
    inventory: 32,
  },
  {
    name: "USB-C Cable",
    sales: 521,
    revenue: 10420,
    growth: 3.7,
    inventory: 215,
  },
];
const TopProducts: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-primary/5">
          <CardContent className="p-2 sm:p-3 text-center">
            <Award className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              Top Product
            </div>
            <div className="mt-1 text-xs sm:text-sm font-medium truncate">
              {products[0].name}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 text-center">
            <Package className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              Total Sales
            </div>
            <div className="mt-1 text-xs sm:text-sm font-medium">
              {formatNumber(products.reduce((sum, p) => sum + p.sales, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-2 sm:p-3 text-center">
            <TrendingUp className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              Avg Growth
            </div>
            <div className="mt-1 text-xs sm:text-sm font-medium">
              {(
                products.reduce((sum, p) => sum + p.growth, 0) / products.length
              ).toFixed(1)}
              %
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        {products.map((product, index) => (
          <Card key={index} className={index === 0 ? "border-primary/50" : ""}>
            <CardContent className="p-2 sm:p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-[10px] sm:text-xs font-bold text-primary">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="max-w-[100px] sm:max-w-full">
                    <div className="font-medium text-xs sm:text-sm truncate">
                      {product.name}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground">
                      {formatNumber(product.sales)} units
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-xs sm:text-sm">
                    {formatCurrency(product.revenue)}
                  </div>
                  <div className="flex items-center justify-end text-[10px] sm:text-xs">
                    <TrendingUp className="mr-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
                    <span className="text-green-500">{product.growth}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export { TopProducts };
