'use client';

import {
  Add,
  Remove,
  FavoriteRounded,
  DeleteOutline,
  KeyboardArrowUp,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectPackageItems,
  selectShipmentTotal,
} from '../selectors';
import { PRODUCT_CATALOG, TABS } from '../data';
import type { CatalogGroup, CatalogTab } from '../data';
import { updateQuantity } from '../slice';
import type { PackageItem } from '../types';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(value);


const recommendationToneStyles: Record<
  NonNullable<CatalogGroup['recommendationTone']>,
  { bg: string; text: string }
> = {
  green: { bg: '#e7f6d9', text: '#215e37' },
  amber: { bg: '#fff4d6', text: '#7a4f11' },
};

interface CatalogItem {
  productId: string;
  label: string;
  accent: string;
  product: PackageItem;
  totalPrice: number;
}

interface CatalogEntry extends CatalogGroup {
  items: CatalogItem[];
}

export function CustomPackagePage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectPackageItems);
  const shipmentTotal = useAppSelector(selectShipmentTotal);

  const [activeTab, setActiveTab] = useState<CatalogTab>('menstrual');

  const itemsById = useMemo<Record<string, PackageItem>>(
    () =>
      items.reduce<Record<string, PackageItem>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}),
    [items]
  );

  const catalog = useMemo<CatalogEntry[]>(() => {
    return PRODUCT_CATALOG.map((group) => ({
      ...group,
      items: group.items
        .map((entry) => {
          const product = itemsById[entry.productId];
          if (!product) return null;
          return {
            ...entry,
            product,
            totalPrice: product.price * product.quantity,
          };
        })
        .filter((entry): entry is CatalogItem => entry !== null),
    }));
  }, [itemsById]);

  const filteredGroups = catalog.filter((group) => group.type === activeTab);

  const summaryGroups = useMemo(() => {
    return catalog
      .map((group) => {
        const selectedItems = group.items.filter(
          (item) => item.product.quantity > 0
        );
        return {
          ...group,
          items: selectedItems,
          total: selectedItems.reduce(
            (acc, item) => acc + item.product.price * item.product.quantity,
            0
          ),
        };
      })
      .filter((group) => group.items.length > 0);
  }, [catalog]);


  const handleStep = (id: string, delta: number) => {
    const current = itemsById[id];
    if (!current) return;
    dispatch(
      updateQuantity({
        id,
        quantity: current.quantity + delta * current.step,
      })
    );
  };

  const handleClearGroup = (group: CatalogEntry) => {
    group.items.forEach((item) => {
      dispatch(updateQuantity({ id: item.productId, quantity: 0 }));
    });
  };

  return (
    <div className="min-h-screen bg-[#f9f5f3] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-16 pt-6 lg:px-8">
        <section className="mt-10 flex flex-1 flex-col gap-36 lg:flex-row">
          <div className="flex-1 space-y-6">
            <IntroCard
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="space-y-5">
              {filteredGroups.map((group) => (
                <ProductGroupCard
                  key={group.id}
                  group={group}
                  onStep={handleStep}
                />
              ))}
            </div>
          </div>

          <aside className="w-full lg:w-[480px]">
            <SummaryPanel
              summaryGroups={summaryGroups}
              shipmentTotal={shipmentTotal}
              onClearGroup={handleClearGroup}
            />
          </aside>
        </section>
      </div>
    </div>
  );
}

// SUBCOMPONENTS

function IntroCard({
  activeTab,
  onTabChange,
}: {
  activeTab: CatalogTab;
  onTabChange: (tab: CatalogTab) => void;
}) {
  return (
    <div>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className='flex justify-between items-center'>
            <Typography
              component="h1"
              variant="h4"
              fontWeight={500}
              className="tracking-tight"
            >
              Kendi Paketini Oluştur
            </Typography>
            <Typography
              component="h1"
              variant="body1"
              className="tracking-tight hidden lg:block"
            >
              Nasıl Çalışır?
            </Typography>

            </div>
            
            <Typography
              variant="body1"
              color="text.secondary"
              className="mt-2 max-w-2xl"
            >
              Tercih ve ihtiyaçların doğrultusunda seçeceğin ürünlerden ve
              miktarlardan, sana özel bir paket oluşturalım.
            </Typography>
          </div>
        </div>
      </CardContent>
      <div className="sticky top-0 z-10 border-b border-slate-200 text-sm font-medium">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'flex-1 relative py-3 transition-colors text-center',
                activeTab === tab.id
                  ? 'text-slate-900'
                  : 'text-slate-600'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-slate-900" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductGroupCard({
  group,
  onStep,
}: {
  group: CatalogEntry;
  onStep: (id: string, delta: number) => void;
}) {
  const RecommendationIcon = group.icon ?? FavoriteRounded;
  const tone =
    (group.recommendationTone &&
      recommendationToneStyles[group.recommendationTone]) || {
      bg: '#e7f6d9',
      text: '#215e37',
    };

  return (
    <Card className="surface-card">
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Typography variant="h6" fontWeight={600}>
              {group.title}
            </Typography>
          </div>
          <div className="px-3 py-1 text-sm font-medium">
            {(() => {
              const itemsWithQuantity = group.items.filter(
                (item) => item.product.quantity > 0
              );
              if (itemsWithQuantity.length === 0) {
                return '0 adet';
              }
              return itemsWithQuantity
                .map((item) => `${item.product.quantity} adet ${item.label}`)
                .join(' ve ');
            })()}
          </div>
        </div>

        {group.recommendation && (
          <Box
            mt={3}
            display="flex"
            gap={2}
            px={2}
            py={2}
            borderRadius="20px"
            sx={{
              backgroundColor: tone.bg,
              color: tone.text,
            }}
          >
            <RecommendationIcon fontSize="small" />
            <Typography variant="body2">{group.recommendation}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 3, borderColor: 'rgba(148,163,184,0.2)' }} />

        <Stack spacing={2}>
          {group.items.map((item) => (
            <ProductRow key={item.productId} item={item} onStep={onStep} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProductRow({
  item,
  onStep,
}: {
  item: {
    productId: string;
    label: string;
    accent: string;
    product: { quantity: number; min: number; max: number };
  };
  onStep: (id: string, delta: number) => void;
}) {
  const quantity = item.product.quantity;
  const canDecrement = quantity > item.product.min;
  const canIncrement = quantity < item.product.max;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span
          className="h-4 w-10 rounded-r-md -ml-4"
          style={{ backgroundColor: item.accent }}
        />
        <Typography variant="body1" fontWeight={500}>
          {item.label}
        </Typography>
      </div>

      <div className="flex items-center gap-2">
        <StepperButton
          ariaLabel={`${item.label} adetini azalt`}
          disabled={!canDecrement}
          onClick={() => onStep(item.productId, -1)}
        >
          <Remove fontSize="small" />
        </StepperButton>
        <div className="w-14 text-center text-base font-semibold">
          {quantity}
        </div>
        <StepperButton
          ariaLabel={`${item.label} adetini artır`}
          disabled={!canIncrement}
          onClick={() => onStep(item.productId, 1)}
        >
          <Add fontSize="small" />
        </StepperButton>
      </div>
    </div>
  );
}

function StepperButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-full border text-lg font-semibold transition-colors',
        disabled
          ? 'cursor-not-allowed border-slate-200 text-slate-300'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      )}
    >
      {children}
    </button>
  );
}

function SummaryPanel({
  summaryGroups,
  shipmentTotal,
  onClearGroup,
}: {
  summaryGroups: Array<CatalogEntry & { total: number }>;
  shipmentTotal: number;
  onClearGroup: (group: CatalogEntry) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const summaryContent = (
    <CardContent>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className='flex justify-between items-center'>
          <Typography variant="h6" fontWeight={600}>
            Özel Paketin
          </Typography>
          <Typography variant="body1" fontWeight={600} className='bg-emerald-200 px-3 py-1 rounded-lg text-sm hidden lg:block'>
            2 ayda bir gönderim
          </Typography>
          </div>
          <Typography variant="body2" color="text.secondary" className="mt-3">
            Kişisel ihtiyacına yönelik istediğin miktarda Ped, 
            Günlük Ped, 
            Tampon veya destekleyici ürünler ekleyerek kendine özel bir 
            paket oluşturabilirsin.
          </Typography>
        </div>
      </div>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={3}>
        {summaryGroups.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Seçimlerini yapmaya başla. Burada paketinin özeti görünecek.
          </Typography>
        ) : (
          summaryGroups.map((group) => (
            <Box key={group.id} className="border-2 rounded-2xl border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <Typography fontWeight={600}>{group.title.replace('beije ', '') + ' Paketleri'}</Typography>
                <IconButton size="small" onClick={() => onClearGroup(group)}>
                  <DeleteOutline fontSize="inherit" />
                </IconButton>
              </div>
              <Stack mt={1.5} spacing={1}>
                {group.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between text-sm text-slate-600"
                  >
                    <span>
                      {item.product.quantity} x {item.label}
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(
                        item.product.price * item.product.quantity
                      )}
                    </span>
                  </div>
                ))}
              </Stack>
            </Box>
          ))
        )}
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={1}>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Gönderim toplamı</span>
          <span className="text-lg font-semibold text-slate-900">
            {formatCurrency(shipmentTotal)}
          </span>
        </div>
      </Stack>

      <Stack mt={3} spacing={1.5}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: '999px',
            py: 1.5,
            fontWeight: 600,
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Sepete Ekle ({formatCurrency(shipmentTotal)})
        </Button>
      </Stack>
    </CardContent>
  );

  return (
    <>
      {/* Desktop view */}
      <Card className="hidden lg:block space-y-4 bg-white/90 shadow-panel backdrop-blur">
        {summaryContent}
      </Card>

      {/* Mobile collapsed bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between items-center">
        <Button
          variant="text"
          color="primary"
          onClick={() => setIsExpanded(true)}
          endIcon={<KeyboardArrowUp />}
        >
          Toplam
        </Button>
        
        <Typography variant="h6" fontWeight={600}>
          {formatCurrency(shipmentTotal)}
        </Typography>
        
      </div>

      {/* Mobile expanded view (drawer) */}
      <Drawer
        open={isExpanded}
        onClose={() => setIsExpanded(false)}
        anchor="bottom"
        className="lg:hidden"
      >
        <Box sx={{ p: 2 }}>
          <div className="flex justify-end">
            <Button onClick={() => setIsExpanded(false)} sx={{ mb: 2, color: 'black' }}>Kapat</Button>
          </div>
          {summaryContent}
        </Box>
      </Drawer>
    </>
  );
}
