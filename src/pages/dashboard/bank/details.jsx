import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';

import { BankDetailView } from 'src/sections/bank/views';

// ----------------------------------------------------------------------

const metadata = { title: `Bank details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentBank = useSelector((state) =>
    state.bank.banks.find((bank) => paramCase(bank._id) === id)
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <BankDetailView bank={currentBank} />
    </>
  );
}
