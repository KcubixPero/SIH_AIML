from django.core.management.base import BaseCommand
from recommendations.views import load_data_and_models

class Command(BaseCommand):
    help = 'Load ML models and data'

    def handle(self, *args, **options):
        self.stdout.write('Loading ML models and data...')
        try:
            load_data_and_models()
            self.stdout.write(
                self.style.SUCCESS('Successfully loaded ML models and data!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error loading models: {e}')
            )
