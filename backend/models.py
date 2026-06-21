from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=True)
    mrn = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    wounds = relationship("Wound", back_populates="patient")
    encounters = relationship("Encounter", back_populates="patient")


class Wound(Base):
    __tablename__ = "wounds"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    location = Column(String, nullable=False)
    etiology = Column(String, nullable=True)
    date_first_documented = Column(String, nullable=True)
    status = Column(String, default="active")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="wounds")
    observations = relationship("Observation", back_populates="wound")


class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    encounter_date = Column(DateTime, default=datetime.utcnow)
    signed = Column(Boolean, default=False)
    signed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="encounters")
    observations = relationship("Observation", back_populates="encounter")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, index=True)
    wound_id = Column(Integer, ForeignKey("wounds.id"), nullable=False)
    encounter_id = Column(Integer, ForeignKey("encounters.id"), nullable=False)

    # Image
    image_path = Column(String, nullable=True)
    ruler_detected = Column(Boolean, nullable=True)
    image_quality_status = Column(String, nullable=True)

    # Measurement — locked policy: official area = length x width only
    measurement_method = Column(String, default="manual")  # manual, basic_geometric, ai_segmented
    length_cm = Column(Float, nullable=True)
    width_cm = Column(Float, nullable=True)
    official_area_cm2 = Column(Float, nullable=True)  # Always length x width
    depth_cm = Column(Float, nullable=True)

    # AI segmentation stored separately — never replaces official_area_cm2 by default
    internal_segmented_area_cm2 = Column(Float, nullable=True)

    # Tissue composition
    granulation_pct = Column(Float, nullable=True)
    slough_pct = Column(Float, nullable=True)
    necrotic_pct = Column(Float, nullable=True)

    # AI tissue tracking
    ai_tissue_estimate_json = Column(Text, nullable=True)
    ai_tissue_shown = Column(Boolean, default=False)
    ai_tissue_accepted = Column(Boolean, default=False)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    wound = relationship("Wound", back_populates="observations")
    encounter = relationship("Encounter", back_populates="observations")
