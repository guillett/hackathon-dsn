import openfisca_france

openfisca_france_tax_benefit_system = openfisca_france.FranceTaxBenefitSystem()

from openfisca_core import reforms
from openfisca_core.errors import VariableNameConflictError

from openfisca_france_data.model.base import (
    ETERNITY,
    Individu,
    Variable,
)


def create_tbs():
    class tbs_extension(reforms.Reform):
        def apply(self):
            class quimen(Variable):
                is_period_size_independent = True
                value_type = int
                entity = Individu
                label = "Rôle dans le ménage"
                definition_period = ETERNITY

            class quifam(Variable):
                is_period_size_independent = True
                value_type = int
                entity = Individu
                label = "Rôle dans la famille"
                definition_period = ETERNITY

            class quifoy(Variable):
                is_period_size_independent = True
                value_type = int
                entity = Individu
                label = "Rôle dans le foyer fiscal"
                definition_period = ETERNITY

            class idmen(Variable):
                is_period_size_independent = True
                value_type = int
                entity = Individu
                label = "Identifiant ménage"
                definition_period = ETERNITY

            class idfam(Variable):
                is_period_size_independent = True
                value_type = int
                entity = Individu
                label = "Identifiant famille"
                definition_period = ETERNITY

            class idfoy(Variable):
                is_period_size_independent = True
                value_type = int
                entity = Individu
                label = "Identifiant foyer fiscal"
                definition_period = ETERNITY

            class id_assure(Variable):
                is_period_size_independent = True
                value_type = int
                entity = Individu
                label = "Identifiant de l'assuré dans la DSN"
                definition_period = ETERNITY

            variables = [idfam, idfoy, idmen, quifam, quifoy, quimen, id_assure]

            for variable in variables:
                if variable == Variable:
                    continue
                try:
                    self.add_variable(variable)
                except VariableNameConflictError:
                    self.update_variable(variable)

    tax_benefits_system = tbs_extension(openfisca_france_tax_benefit_system)

    return tax_benefits_system
