import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {AllCommunityModule, AllEnterpriseModule, LicenseManager, ModuleRegistry} from 'ag-grid-enterprise';

try {
  const licenseKey = 'Using_this_{AG_Grid}_Enterprise_key_{AG-051296}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Marsh_and_Mclennan_Companies,_Inc}_is_granted_a_{Multiple_Applications}_Developer_License_for_{10}_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_need_to_be_licensed_in_addition_to_the_ones_working_with_{AG_Grid}_Enterprise___This_key_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{14_June_2025}____[v3]_[01]_MTc0OTg1NTYwMDAwMA==dc95199c9c8095dba754060c86df86a0'
  LicenseManager.setLicenseKey(licenseKey);
  ModuleRegistry.registerModules([AllCommunityModule]);
  ModuleRegistry.registerModules([AllEnterpriseModule]);
  console.log('ag-grid initialization skipped - packages not installed yet');
} catch (error) {
  console.log('ag-grid initialization skipped - packages not installed yet');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
