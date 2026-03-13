import ErrorState from '@/components/shared/ErrorState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import PageHeader from '@/components/shared/PageHeader';
import { FileImage } from '@/components/shared/FileImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useServiceCategory } from './useServiceCategories';

export default function ServiceCategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: category,
    isLoading,
    isError,
    refetch,
  } = useServiceCategory(id!);

  if (isLoading)
    return (
      <div className="p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  if (isError || !category) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/service-categories">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <PageHeader heading={category.title} text={category.tagline} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 overflow-hidden h-fit">
           <FileImage
             path={category.heroImage}
             alt={category.title}
             className="w-full h-48 object-cover"
           />
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {category.attributes?.map((attr, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{attr}</span>
                </li>
              ))}
              {(!category.attributes || category.attributes.length === 0) && (
                <p className="text-xs text-muted-foreground italic">No highlights listed.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Divisions ({category.divisions?.length || 0})
            </h2>
            <Button size="sm" asChild>
              <Link to={`/divisions?serviceCategoryId=${category.id}`}>
                Manage All
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {category.divisions?.map((division) => (
              <Card
                key={division.id}
                className="group hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-4 flex items-center gap-4">
                   <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                    <FileImage
                      path={division.logo}
                      alt=""
                      className="w-full h-full object-cover"
                      fallback={<Building2 className="h-6 w-6 text-muted-foreground" />}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{division.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {division.location || 'No location set'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    asChild
                  >
                    <Link to={`/divisions/${division.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
                <div className="px-4 pb-3 flex gap-2">
                  <Badge
                    variant={division.isActive ? 'default' : 'secondary'}
                    className="text-[10px] px-1.5 py-0 h-5"
                  >
                    {division.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-5"
                  >
                    {division.divisionCategory?.label}
                  </Badge>
                </div>
              </Card>
            ))}
            {(!category.divisions || category.divisions.length === 0) && (
              <Card className="col-span-full py-12 flex flex-col items-center justify-center bg-muted/20 border-dashed">
                <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No divisions assigned to this category yet.
                </p>
                <Button variant="link" className="mt-2" asChild>
                  <Link to="/divisions">Go to Divisions</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
